package helpers

import (
	"errors"

	"github.com/alexhans1/certainty_poker/graph/model"
)

func FindGame(games map[string]*model.Game, id string) (game *model.Game, err error) {
	if game, ok := games[id]; ok {
		return game, nil
	}
	return nil, errors.New("Game not found")
}

func FindPlayer(slice []*model.Player, id string) (player *model.Player, err error) {
	for i := range slice {
		if slice[i].ID == id {
			return slice[i], nil
		}
	}
	return nil, errors.New("Player not found")
}

func FindQuestionRound(slice []*model.QuestionRound, id string) (questionRound *model.QuestionRound, err error) {
	for i := range slice {
		if slice[i].ID == id {
			return slice[i], nil
		}
	}
	return nil, errors.New("QuestionRound not found")
}

func FindBettingRound(slice []*model.BettingRound, id string) (bettingRound *model.BettingRound, err error) {
	for i := range slice {
		if slice[i].ID == id {
			return slice[i], nil
		}
	}
	return nil, errors.New("BettingRound not found")
}
