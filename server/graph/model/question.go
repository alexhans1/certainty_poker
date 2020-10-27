package model

import (
	"encoding/json"
	"io/ioutil"
	"math/rand"
	"os"

	"github.com/alexhans1/certainty_poker/helpers"
)

// NewQuestion constructor
func NewQuestion(question string, answer float64, hints []string) *Question {
	q := new(Question)

	q.Question = question
	q.Answer = answer
	q.Hints = hints
	q.ID = helpers.CreateID()

	return q
}

// LoadQuestions load questions from json file
func LoadQuestions() []Question {
	questionsJSON, _ := os.Open("../questions.json")

	defer questionsJSON.Close()
	byteValue, _ := ioutil.ReadAll(questionsJSON)

	var allQuestions []Question
	json.Unmarshal(byteValue, &allQuestions)

	return allQuestions
}

// DrawQuestion draws a random Question which is not burnt yet
func DrawQuestion(burntQuestions []string) *Question {
	allQuestions := LoadQuestions()
	openQuestions := make([]Question, 0)

	for _, question := range allQuestions {
		if helpers.ContainsString(burntQuestions, question.Question) {
			continue
		} else {
			openQuestions = append(openQuestions, question)
		}
	}

	randomIndex := rand.Intn(len(openQuestions))
	drawnQuestion := &openQuestions[randomIndex]

	return drawnQuestion
}
