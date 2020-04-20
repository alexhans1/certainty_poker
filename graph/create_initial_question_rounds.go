package graph

import (
	"strconv"

	"github.com/alexhans1/certainty_poker/graph/model"
)

func createQuestionRound(index int) model.QuestionRound {
	questionRound := model.QuestionRound{
		ID: createID(),
		Question: &model.Question{
			ID:       createID(),
			Question: "Test Question " + strconv.Itoa(index+1),
			Answer:   44,
			Hints:    createHints(index),
		},
		Guesses:             make([]*model.Guess, 0),
		BettingRounds:       make([]*model.BettingRound, 0),
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
			ID:                 createID(),
			FoldedPlayerIds:    make([]string, 0),
			Bets:               make([]*model.Bet, 0),
			CurrentPlayerID:    "not started",
			LastRaisedPlayerID: "not started",
		})
	}
	return bettingRounds
}

func createInitialQuestionRounds() []*model.QuestionRound {
	questionRounds := make([]*model.QuestionRound, 0)

	for i := 0; i < 10; i++ {
		questionRound := createQuestionRound(i)
		questionRounds = append(questionRounds, &questionRound)
	}
	return questionRounds
}
