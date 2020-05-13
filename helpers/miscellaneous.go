package helpers

import "github.com/google/uuid"

// CreateID creates a new uuid.
func CreateID() string {
	return uuid.New().String()
}

// ContainsString tells whether string slice contains x.
func ContainsString(slice []string, x string) bool {
	for _, n := range slice {
		if x == n {
			return true
		}
	}
	return false
}
