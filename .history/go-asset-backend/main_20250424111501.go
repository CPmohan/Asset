package main

import (
	"fmt"
	"log"
	"net/http"

	"go-asset-backend/handlers"
)

func main() {
	http.HandleFunc("/api/assets", handlers.HandleAssetUpload)
	http.HandleFunc("/api/assets/group/", handlers.HandleGetAssetsByGroup)
	
	fmt.Println("Server running at http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
