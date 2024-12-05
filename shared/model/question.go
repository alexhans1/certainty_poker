package model

import (
	"github.com/thoas/go-funk"
)

// DrawQuestion draws the next Question and removes it from the slice
func DrawQuestion(g *Game) *Question {
	drawnQuestion := g.Questions[len(g.QuestionRounds)]
	if drawnQuestion == nil {
		panic("drawnQuestion is nil")
	}

	return drawnQuestion
}

// GetHiddenAlternative returns one of the incorrect alternatives
// that is not yet hidden
func (q *Question) GetHiddenAlternative() string {
	falseAlternatives := []string{}
	for i, alt := range q.Alternatives {
		if float64(i) != *q.Answer.Numerical {
			falseAlternatives = append(falseAlternatives, alt)
		}
	}
	remainingAlternatives, _ := funk.DifferenceString(falseAlternatives, q.HiddenAlternatives)

	return remainingAlternatives[funk.RandomInt(0, len(remainingAlternatives)-1)]
}
