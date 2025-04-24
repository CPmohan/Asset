package models

// FileTypePayload represents the file type's label and value for an asset.
type FileTypePayload struct {
	Label string `json:"label"`
	Value string `json:"value"`
}

// FileInfo represents metadata about the files associated with an asset.
type FileInfo struct {
	Filename  string `json:"filename"`
	Type      string `json:"type"`
	TypeValue string `json:"typeValue"`
}

// AssetPayload represents the data sent by the client when creating or updating an asset.
type AssetPayload struct {
	Name      string            `json:"name"`
	Quantity  int               `json:"quantity"`
	Group     []string          `json:"group"`
	FileTypes []FileTypePayload `json:"fileTypes"` // List of file types associated with the asset
	Files     []FileInfo        `json:"files"`     // List of files associated with the asset
}
