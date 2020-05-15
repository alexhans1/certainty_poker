package model

import (
  "github.com/alexhans1/certainty_poker/helpers"
)

func NewQuestion(question string, answer float64, hints []string) *Question {
  q := new(Question)

  q.Question = question
  q.Answer = answer
  q.Hints = hints
  q.Id = helpers.CreateId()

  return q
}
