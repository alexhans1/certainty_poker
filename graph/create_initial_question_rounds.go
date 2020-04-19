package graph

import (
	"strconv"

	"github.com/alexhans1/certainty_poker/graph/model"
)

func createQuestionRound(index int) model.QuestionRound {
	return model.QuestionRound{
		ID: createID(),
		Question: &model.Question{
			ID:       createID(),
			Question: "Test Question " + strconv.Itoa(index+1),
			Answer:   44,
			Hints:    createHints(index),
		},
		Guesses:       make([]*model.Guess, 0),
		BettingRounds: make([]*model.BettingRound, 0),
	}
}

func createHints(index int) []string {
	hints := make([]string, 0)

	for i := 0; i < 3; i++ {
		hints = append(hints, "Test Hint "+strconv.Itoa(i+1)+" for Question "+strconv.Itoa(index+1))
	}
	return hints
}

func createInitialQuestionRounds() []*model.QuestionRound {
	questionRounds := make([]*model.QuestionRound, 0)

	for i := 0; i < 10; i++ {
		questionRound := createQuestionRound(i)
		questionRounds = append(questionRounds, &questionRound)
	}
	return questionRounds
}
