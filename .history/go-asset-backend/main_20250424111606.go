package main

import (
	"fmt"
	"log"
	"net/http"
	"strings"

	"go-asset-backend/handlers"
)

func main() {
	// Asset CRUD operations
	http.HandleFunc("/api/assets", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPost:
			handlers.HandleAssetUpload(w, r)
		default:
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	})

	// Group and asset specific routes
	http.HandleFunc("/api/assets/", func(w http.ResponseWriter, r *http.Request) {
		path := r.URL.Path
		
		// Route for getting assets by group
		if strings.HasPrefix(path, "/api/assets/group/") {
			handlers.HandleGetAssetsByGroup(w, r)
			return
		}
		
		// Route for getting single asset details
		parts := strings.Split(path, "/")
		if len(parts) >= 5 && parts[3] != "group" {
			handlers.HandleGetAsset(w, r)
			return
		}
		
		http.NotFound(w, r)
	})

	// Serve uploaded files
	http.Handle("/uploads/", 
		http.StripPrefix("/uploads/", 
			http.FileServer(http.Dir("./uploads"))))

	// CORS preflight handler
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodOptions {
			handlers.EnableCors(&w)
			w.WriteHeader(http.StatusOK)
			return
		}
		http.NotFound(w, r)
	})

	fmt.Println("Server running at http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}