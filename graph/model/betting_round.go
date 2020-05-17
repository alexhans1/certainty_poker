package model

import (
	"errors"
)

// FindBettingRound finds by id
func FindBettingRound(slice []*BettingRound, id string) (bettingRound *BettingRound, err error) {
	for i := range slice {
		if slice[i].ID == id {
			return slice[i], nil
		}
	}
	return nil, errors.New("BettingRound not found")
}
