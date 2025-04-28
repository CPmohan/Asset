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
	http.HandleFunc("/api/group-counts", handlers.HandleGroupCounts)

	http.HandleFunc("/api/assets", func(w http.ResponseWriter, r *http.Request) {
		handlers.EnableCors(&w) // Apply CORS here first
		switch r.Method {
		case http.MethodPost:
			handlers.HandleAssetUpload(w, r)
		default:
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	})

	// Group and asset specific routes
	http.HandleFunc("/api/assets/", func(w http.ResponseWriter, r *http.Request) {
		handlers.EnableCors(&w) // Apply CORS here first
		path := r.URL.Path

		// Route for getting assets by group
		if strings.HasPrefix(path, "/api/assets/group/") {
			handlers.HandleGetAssetsByGroup(w, r)
			return
		}

		// Route for getting single asset details
		parts := strings.Split(path, "/")
		if len(parts) >= 5 && parts[3] != "group" {
			handlers.HandleGetAssetByName(w, r)
			return
		}

		http.NotFound(w, r)
	})

	// Serve uploaded files with CORS support
	http.Handle("/uploads/",
		http.StripPrefix("/uploads/",
			http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				handlers.EnableCors(&w) // Apply CORS here first
				http.FileServer(http.Dir("./uploads")).ServeHTTP(w, r)
			}),
		),
	)

	// CORS preflight handler
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		handlers.EnableCors(&w) // Apply CORS here first
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}
		http.NotFound(w, r)
	})

	fmt.Println("Server running at http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
