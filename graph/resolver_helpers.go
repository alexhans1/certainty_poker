package graph

import (
	"errors"
	"math/rand"

	"github.com/alexhans1/certainty_poker/graph/model"
	"github.com/google/uuid"
)

func findGame(games map[string]*model.Game, id string) (game *model.Game, err error) {
	if game, ok := games[id]; ok {
		return game, nil
	}
	return nil, errors.New("Game not found")
}

func findQuestionRound(slice []*model.QuestionRound, id string) (questionRound *model.QuestionRound, err error) {
	for i := range slice {
		if slice[i].ID == id {
			return slice[i], nil
		}
	}
	return nil, errors.New("QuestionRound not found")
}

func findBettingRound(slice []*model.BettingRound, id string) (bettingRound *model.BettingRound, err error) {
	for i := range slice {
		if slice[i].ID == id {
			return slice[i], nil
		}
	}
	return nil, errors.New("BettingRound not found")
}

func createID() string {
	return uuid.New().String()
}

func shufflePlayers(playerSlice []*model.Player) {
	for i := range playerSlice {
		j := rand.Intn(i + 1)
		playerSlice[i], playerSlice[j] = playerSlice[j], playerSlice[i]
	}
}
