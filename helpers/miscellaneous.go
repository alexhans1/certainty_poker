package helpers

import (
	"errors"
	"github.com/google/uuid"
)

// CreateId creates a new uuid.
func CreateId() string {
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

func MaxInt(slice []int) (int, error) {
	if len(slice) == 0 {
		return 0, errors.New("Cannot find maximum of empty slice.")
	}
	max:= slice[0]

	for _, value := range slice {
		if value > max {
			max = value
		}
	}

	return max, nil
}

// Minimum value of a map string -> int
func MinValueMapStringInt(m map[string]int, keys []string) (int, error) {
	first := false
	min := 0
	for key, value := range m {
		if len(keys) == 0 || ContainsString(keys, key) {
			if first == false {
				first = true
				min = value
			} else {
				if value < min {
					min = value
				}
			}
		}
	}
	if first == false {
		return 0,  errors.New("None of the keys found in map")
	} else {
		return min, nil
	}
}
