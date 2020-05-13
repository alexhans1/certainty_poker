package model

import(
	"errors"
)

func FindBettingRound(slice []*BettingRound, id string) (bettingRound *BettingRound, err error) {
	for i := range slice {
		if slice[i].Id == id {
			return slice[i], nil
		}
	}
	return nil, errors.New("BettingRound not found")
}
