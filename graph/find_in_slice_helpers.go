package graph

import (
	"github.com/alexhans1/certainty_poker/graph/model"
	"github.com/google/uuid"
)

func findPlayer(slice []model.Player, id string) (player *model.Player, ok bool) {
	for i := range slice {
		if slice[i].ID == id {
			return &slice[i], true
		}
	}
	return nil, false
}

func findPlayerIndex(slice []model.Player, id string) int {
	for i := range slice {
		if slice[i].ID == id {
			return i
		}
	}
	return -1
}

func createID() string {
	return uuid.New().String()
}
