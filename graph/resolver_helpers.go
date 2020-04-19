package graph

import (
	"github.com/alexhans1/certainty_poker/graph/model"
	"github.com/google/uuid"
)

func findGame(slice []*model.Game, id string) (game *model.Game, ok bool) {
	for i := range slice {
		if slice[i].ID == id {
			return slice[i], true
		}
	}
	return nil, false
}

func findPlayer(slice []*model.Player, id string) (player *model.Player, ok bool) {
	for i := range slice {
		if slice[i].ID == id {
			return slice[i], true
		}
	}
	return nil, false
}

func findQuestionRound(slice []*model.QuestionRound, id string) (questionRound *model.QuestionRound, ok bool) {
	for i := range slice {
		if slice[i].ID == id {
			return slice[i], true
		}
	}
	return nil, false
}

func findBettingRound(slice []*model.BettingRound, id string) (bettingRound *model.BettingRound, ok bool) {
	for i := range slice {
		if slice[i].ID == id {
			return slice[i], true
		}
	}
	return nil, false
}

func createID() string {
	return uuid.New().String()
}
