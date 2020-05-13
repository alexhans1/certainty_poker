package helpers

import (
	"math/rand"

	"github.com/alexhans1/certainty_poker/graph/model"
)

func CreateFoldedPlayerIDsSlice(players []*model.Player, questionRound *model.QuestionRound) {
	for _, player := range players {
		if !ContainsString(questionRound.FoldedPlayerIds, player.ID) && player.Money <= 0 {
			questionRound.FoldedPlayerIds = append(questionRound.FoldedPlayerIds, player.ID)
		}
	}
}

func ShufflePlayers(playerSlice []*model.Player) {
	for i := range playerSlice {
		j := rand.Intn(i + 1)
		playerSlice[i], playerSlice[j] = playerSlice[j], playerSlice[i]
	}
}
