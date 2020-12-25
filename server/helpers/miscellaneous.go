package helpers

import (
	"errors"
	"math"

	"github.com/google/uuid"
)

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

// MaxInt returns largest
func MaxInt(slice []int) (int, error) {
	if len(slice) == 0 {
		return 0, errors.New("cannot find maximum of empty slice")
	}
	max := slice[0]

	for _, value := range slice {
		if value > max {
			max = value
		}
	}

	return max, nil
}

// MinValueMapStringInt returns minimum value of a map string -> int
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
		return 0, errors.New("None of the keys found in map")
	} else {
		return min, nil
	}
}

func SliceStringEqual(sliceOne []string, sliceTwo []string) bool {
	if len(sliceOne) != len(sliceTwo) {
		return false
	}

	for index, elementOne := range sliceOne {
		if sliceTwo[index] != elementOne {
			return false
		}
	}

	return true
}

func SliceIntEqual(sliceOne []int, sliceTwo []int) bool {
	if len(sliceOne) != len(sliceTwo) {
		return false
	}

	for index, elementOne := range sliceOne {
		if sliceTwo[index] != elementOne {
			return false
		}
	}

	return true
}

func SliceSliceStringEqual(sliceOne [][]string, sliceTwo [][]string) bool {
	if len(sliceOne) != len(sliceTwo) {
		return false
	}

	for index, elementOne := range sliceOne {
		if !SliceStringEqual(elementOne, sliceTwo[index]) {
			return false
		}
	}

	return true
}

// SliceStringIndex returns index of first occurrence of item in slice or -1, if item is not contained
func SliceStringIndex(slice []string, item string) int {
	foundIndex := -1

	for index, element := range slice {
		if item == element {
			foundIndex = index
			break
		}
	}

	return foundIndex
}

func IntAbs(n int) int {
	return int64(math.Abs(float64(n)))
}