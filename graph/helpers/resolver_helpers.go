package helpers

import (
	"math/rand"

	"github.com/alexhans1/certainty_poker/graph/model"
	"github.com/google/uuid"
)

func CreateID() string {
	return uuid.New().String()
}

func ShufflePlayers(playerSlice []*model.Player) {
	for i := range playerSlice {
		j := rand.Intn(i + 1)
		playerSlice[i], playerSlice[j] = playerSlice[j], playerSlice[i]
	}
}
