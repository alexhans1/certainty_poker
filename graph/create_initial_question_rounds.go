package graph

import (
	"math/rand"
	"strconv"

	"github.com/alexhans1/certainty_poker/graph/model"
	"github.com/alexhans1/certainty_poker/helpers"
)

func createQuestionRound(index int) model.QuestionRound {
	questionRound := model.QuestionRound{
		ID: helpers.CreateID(),
		Question: &model.Question{
			ID:       helpers.CreateID(),
			Question: "Test Question " + strconv.Itoa(index+1),
			Answer:   rand.Float64() * 1000,
			Hints:    createHints(index),
		},
		Guesses:             make([]*model.Guess, 0),
		BettingRounds:       make([]*model.BettingRound, 0),
		FoldedPlayerIds:     make([]string, 0),
		CurrentBettingRound: -1,
	}

	questionRound.BettingRounds = createBettingRounds(len(questionRound.Question.Hints) + 1)
	return questionRound
}

func createHints(index int) []string {
	hints := make([]string, 0)

	for i := 0; i < 3; i++ {
		hints = append(hints, "Test Hint "+strconv.Itoa(i+1)+" for Question "+strconv.Itoa(index+1))
	}
	return hints
}

func createBettingRounds(length int) []*model.BettingRound {
	bettingRounds := make([]*model.BettingRound, 0)

	for i := 0; i < length; i++ {
		bettingRounds = append(bettingRounds, &model.BettingRound{
			ID:                 helpers.CreateID(),
			Bets:               make([]*model.Bet, 0),
			CurrentPlayerID:    "not started",
			LastRaisedPlayerID: "not started",
		})
	}
	return bettingRounds
}

func createInitialQuestionRounds() []*model.QuestionRound {
	questionRounds := make([]*model.QuestionRound, 0)

	for i := 0; i < 5; i++ {
		questionRound := createQuestionRound(i)
		questionRounds = append(questionRounds, &questionRound)
	}
	return questionRounds
}
