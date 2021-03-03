package tests

import (
	"testing"

	"github.com/alexhans1/certainty_poker/graph/model"
)

func TestOrderDistanceCorrectAnswer(t *testing.T) {
	correctAnswer := &model.Answer{
		Order: []string{"1", "2", "3", "4"},
	}
	guess := &model.Guess{
		PlayerID: "1",
		Guess:    correctAnswer,
	}

	dist := guess.GetOrderDistance(correctAnswer)
	if dist != 0 {
		t.Errorf("Correct guess must have distance 0 to correct answer.")
	}
}

func TestOrderDistanceWrongPair(t *testing.T) {
	correctAnswer := &model.Answer{
		Order: []string{"1", "2", "3", "4"},
	}
	incorrectAnswer := &model.Answer{
		Order: []string{"1", "3", "2", "4"},
	}
	guess := &model.Guess{
		PlayerID: "1",
		Guess:    incorrectAnswer,
	}

	dist := guess.GetOrderDistance(correctAnswer)
	if dist != 1 {
		t.Errorf("Distance of guess to correct answer must be 1.")
	}
}

func TestOrderDistanceReverseOrder(t *testing.T) {
	correctAnswer := &model.Answer{
		Order: []string{"1", "2", "3", "4"},
	}
	incorrectAnswer := &model.Answer{
		Order: []string{"4", "3", "2", "1"},
	}
	guess := &model.Guess{
		PlayerID: "1",
		Guess:    incorrectAnswer,
	}

	dist := guess.GetOrderDistance(correctAnswer)
	if dist != 4 {
		t.Errorf("Distance of guess to correct answer must be 1.")
	}
}
