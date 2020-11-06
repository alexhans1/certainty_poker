package model

import (
	"encoding/json"
	"io/ioutil"
	"os"

	"github.com/alexhans1/certainty_poker/helpers"
)

// LoadQuestions loads the questions from json file
func LoadQuestions() []*Question {
	questionsJSON, _ := os.Open("./questions.json")

	defer questionsJSON.Close()
	byteValue, _ := ioutil.ReadAll(questionsJSON)

	var allQuestions []*Question
	json.Unmarshal(byteValue, &allQuestions)
	for _, q := range allQuestions {
		q.ID = helpers.CreateID()
	}

	return allQuestions
}

// DrawQuestion draws a random Question and removes it from the slice
func DrawQuestion(g *Game) *Question {
	drawnQuestion := g.Questions[0]
	g.Questions = g.Questions[1:]

	return drawnQuestion
}
