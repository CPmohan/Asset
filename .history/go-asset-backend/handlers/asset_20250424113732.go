package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"os"
	"strings"

	_ "github.com/go-sql-driver/mysql"
)

// Structs

type FileInfo struct {
	Filename  string `json:"filename"`
	Type      string `json:"type"`
	TypeValue string `json:"typeValue"`
}

type AssetPayload struct {
	Name      string     `json:"name"`
	Quantity  int        `json:"quantity"`
	Group     []string   `json:"group"`
	FileTypes []FileInfo `json:"fileTypes"`
	Files     []FileInfo `json:"files"`
}

// DB connection

var db *sql.DB

func init() {
	var err error
	dsn := "root:Zeb2001@cp@tcp(127.0.0.1:3306)/asset_db"

	db, err = sql.Open("mysql", dsn)
	if err != nil {
		panic(err)
	}

	if err = db.Ping(); err != nil {
		panic(err)
	}

	os.MkdirAll("./uploads", os.ModePerm)

	createTables()
}

func createTables() {
	tableQueries := []string{
		`CREATE TABLE IF NOT EXISTS assets (
			id INT AUTO_INCREMENT PRIMARY KEY,
			name VARCHAR(255) NOT NULL,
			quantity INT,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)`,
		`CREATE TABLE IF NOT EXISTS asset_groups (
			id INT AUTO_INCREMENT PRIMARY KEY,
			asset_id INT,
			group_name VARCHAR(100),
			FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE
		)`,
		`CREATE TABLE IF NOT EXISTS file_types (
			id INT AUTO_INCREMENT PRIMARY KEY,
			asset_id INT,
			label VARCHAR(100),
			value VARCHAR(100),
			FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE
		)`,
		`CREATE TABLE IF NOT EXISTS uploaded_files (
			id INT AUTO_INCREMENT PRIMARY KEY,
			asset_id INT,
			filename VARCHAR(255),
			type VARCHAR(100),
			type_value VARCHAR(100),
			FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE
		)`,
	}

	for _, query := range tableQueries {
		if _, err := db.Exec(query); err != nil {
			panic(err)
		}
	}
}

// CORS setup

func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	(*w).Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
	(*w).Header().Set("Access-Control-Allow-Headers", "Content-Type")
}

// Handlers

func HandleGetAssetsByGroup(w http.ResponseWriter, r *http.Request) {
	enableCors(&w)
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	groupName := strings.TrimPrefix(r.URL.Path, "/api/assets/group/")
	groupName = strings.ToLower(strings.TrimSpace(groupName))

	if groupName == "" {
		http.Error(w, "Group name is required", http.StatusBadRequest)
		return
	}

	query := `
		SELECT a.id, a.name, a.quantity 
		FROM assets a 
		JOIN asset_groups ag ON a.id = ag.asset_id 
		WHERE LOWER(TRIM(ag.group_name)) = ?`
	rows, err := db.Query(query, groupName)
	if err != nil {
		http.Error(w, "DB query error: "+err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var assets []AssetPayload
	totalAssets := 0

	for rows.Next() {
		var asset AssetPayload
		var id int
		if err := rows.Scan(&id, &asset.Name, &asset.Quantity); err != nil {
			http.Error(w, "Error scanning asset: "+err.Error(), http.StatusInternalServerError)
			return
		}
		assets = append(assets, asset)
		totalAssets++
	}

	response := map[string]interface{}{
		"assets":       assets,
		"total_assets": totalAssets,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func HandleAssetUpload(w http.ResponseWriter, r *http.Request) {
	enableCors(&w)
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	if r.Method != http.MethodPost {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	err := r.ParseMultipartForm(32 << 20) // Limit the file size to 32 MB
	if err != nil {
		http.Error(w, "Error parsing form: "+err.Error(), http.StatusBadRequest)
		return
	}

	var payload AssetPayload
	err = json.Unmarshal([]byte(r.FormValue("metadata")), &payload)
	if err != nil {
		http.Error(w, "Error parsing metadata: "+err.Error(), http.StatusBadRequest)
		return
	}

	tx, err := db.Begin()
	if err != nil {
		http.Error(w, "Error starting transaction: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Insert asset
	res, err := tx.Exec("INSERT INTO assets (name, quantity) VALUES (?, ?)", payload.Name, payload.Quantity)
	if err != nil {
		tx.Rollback()
		http.Error(w, "DB insert error: "+err.Error(), http.StatusInternalServerError)
		return
	}

	assetID, err := res.LastInsertId()
	if err != nil {
		tx.Rollback()
		http.Error(w, "Error getting insert ID: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Insert groups
	for _, group := range payload.Group {
		_, err := tx.Exec("INSERT INTO asset_groups (asset_id, group_name) VALUES (?, ?)", assetID, strings.ToLower(strings.TrimSpace(group)))
		if err != nil {
			tx.Rollback()
			http.Error(w, "Error saving group: "+err.Error(), http.StatusInternalServerError)
			return
		}
	}

	// Insert file types
	for _, ft := range payload.FileTypes {
		_, err := tx.Exec("INSERT INTO file_types (asset_id, label, value) VALUES (?, ?, ?)", assetID, ft.Type, ft.TypeValue)
		if err != nil {
			tx.Rollback()
			http.Error(w, "Error saving file type: "+err.Error(), http.StatusInternalServerError)
			return
		}
	}

	// Handle files
	files := r.MultipartForm.File["files"]
	for i, fileHeader := range files {
		err := saveUploadedFile(fileHeader)
		if err != nil {
			tx.Rollback()
			http.Error(w, "File upload error: "+err.Error(), http.StatusInternalServerError)
			return
		}

		// Get the corresponding file info for the asset
		info := payload.Files[i]

		// Insert the file type info into the file_types table
		_, err = tx.Exec(
			"INSERT INTO file_types (asset_id, label, value) VALUES (?, ?, ?)",
			assetID, info.Type, info.TypeValue)
		if err != nil {
			tx.Rollback()
			http.Error(w, "Error saving file type: "+err.Error(), http.StatusInternalServerError)
			return
		}

		// Insert the file metadata into the uploaded_files table
		_, err = tx.Exec(
			"INSERT INTO uploaded_files (asset_id, filename, type, type_value) VALUES (?, ?, ?, ?)",
			assetID, info.Filename, info.Type, info.TypeValue)
		if err != nil {
			tx.Rollback()
			http.Error(w, "Error saving file metadata: "+err.Error(), http.StatusInternalServerError)
			return
		}
	}

	if err = tx.Commit(); err != nil {
		http.Error(w, "Transaction commit error: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	fmt.Fprintln(w, "Asset created successfully")
}

// File handling helpers

func saveUploadedFile(fileHeader *multipart.FileHeader) error {
	file, err := fileHeader.Open()
	if err != nil {
		return err
	}
	defer file.Close()

	dst, err := os.Create("./uploads/" + sanitize(fileHeader.Filename))
	if err != nil {
		return err
	}
	defer dst.Close()

	_, err = io.Copy(dst, file)
	return err
}

func sanitize(name string) string {
	return strings.ReplaceAll(name, "..", "")
}
func HandleGetAsset(w http.ResponseWriter, r *http.Request) {
    enableCors(&w)
    if r.Method == http.MethodOptions {
        w.WriteHeader(http.StatusOK)
        return
    }

    pathParts := strings.Split(r.URL.Path, "/")
    if len(pathParts) < 5 {
        http.Error(w, "Invalid URL format", http.StatusBadRequest)
        return
    }

    groupName := pathParts[3]
    assetName := pathParts[4]

    // Get basic asset info
    var asset AssetPayload
    var assetID int
    err := db.QueryRow(`
        SELECT a.id, a.name, a.quantity 
        FROM assets a
        JOIN asset_groups ag ON a.id = ag.asset_id
        WHERE a.name = ? AND LOWER(TRIM(ag.group_name)) = ?
    `, assetName, strings.ToLower(strings.TrimSpace(groupName))).Scan(&assetID, &asset.Name, &asset.Quantity)
    if err != nil {
        http.Error(w, "Asset not found: "+err.Error(), http.StatusNotFound)
        return
    }

    // Get groups
    rows, err := db.Query("SELECT group_name FROM asset_groups WHERE asset_id = ?", assetID)
    if err != nil {
        http.Error(w, "Error fetching groups: "+err.Error(), http.StatusInternalServerError)
        return
    }
    defer rows.Close()

    var groups []string
    for rows.Next() {
        var group string
        if err := rows.Scan(&group); err != nil {
            http.Error(w, "Error scanning group: "+err.Error(), http.StatusInternalServerError)
            return
        }
        groups = append(groups, group)
    }
    asset.Group = groups

    // Get files
    rows, err = db.Query(`
        SELECT filename, type, type_value 
        FROM uploaded_files 
        WHERE asset_id = ?
    `, assetID)
    if err != nil {
        http.Error(w, "Error fetching files: "+err.Error(), http.StatusInternalServerError)
        return
    }
    defer rows.Close()

    var files []FileInfo
    for rows.Next() {
        var file FileInfo
        if err := rows.Scan(&file.Filename, &file.Type, &file.TypeValue); err != nil {
            http.Error(w, "Error scanning file: "+err.Error(), http.StatusInternalServerError)
            return
        }
        // Add the full URL path to the file
        // file.Filename = "/uploads/" + file.Filename
		file.Filename = "http://localhost:8080/uploads/" + file.Filename

        files = append(files, file)
    }
    asset.Files = files

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(asset)
}
// Add this to your handlers/asset.go file (if not already present)
func EnableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	(*w).Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	(*w).Header().Set("Access-Control-Allow-Headers", "Content-Type")
}