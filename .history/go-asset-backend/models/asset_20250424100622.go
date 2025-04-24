package models

type FileTypePayload struct {
	Label string `json:"label"`
	Value string `json:"value"`
}

type FileInfo struct {
	Filename  string `json:"filename"`
	Type      string `json:"type"`
	TypeValue string `json:"typeValue"`
}

type AssetPayload struct {
	Name      string            `json:"name"`
	Quantity  int               `json:"quantity"`
	Group     []string          `json:"group"`
	FileTypes []FileTypePayload `json:"fileTypes"`  // ✅ Updated
	Files     []FileInfo        `json:"files"`
}
