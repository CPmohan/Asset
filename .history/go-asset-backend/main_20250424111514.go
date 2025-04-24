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
	http.HandleFunc("/api/assets/", func(w http.ResponseWriter, r *http.Request) {
    if strings.HasPrefix(r.URL.Path, "/api/assets/group/") {
        handlers.HandleGetAssetsByGroup(w, r)
    } else if strings.Count(r.URL.Path, "/") >= 4 { // For /api/assets/group/asset
        handlers.HandleGetAsset(w, r)
    } else {
        http.NotFound(w, r)
    }
})
	
	fmt.Println("Server running at http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
