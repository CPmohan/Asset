package models

type FileMeta struct {
	Filename   string `json:"filename"`
	Type       string `json:"type"`
	TypeValue  string `json:"typeValue"`
}

type FileType struct {
	Label string `json:"label"`
	Value string `json:"value"`
}

type Asset struct {
	Name      string     `json:"name"`
	Quantity  int        `json:"quantity"`
	Group     []string   `json:"group"`
	FileTypes []FileType `json:"fileTypes"`
	Files     []FileMeta `json:"files"`
}