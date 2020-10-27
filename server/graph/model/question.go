package model

import (
	"encoding/json"
	"io/ioutil"
	"math/rand"
	"os"
	"time"

	"github.com/alexhans1/certainty_poker/helpers"
)

// LoadQuestions loads the questions from json file
func LoadQuestions() []*Question {
	questionsJSON, _ := os.Open("../questions.json")

	defer questionsJSON.Close()
	byteValue, _ := ioutil.ReadAll(questionsJSON)

	var allQuestions []*Question
	json.Unmarshal(byteValue, &allQuestions)
	for _, q := range allQuestions {
		q.ID = helpers.CreateID()
	}

	return allQuestions
}

// DrawQuestion draws a random Question which is not burnt yet
func DrawQuestion(g *Game) *Question {
	rand.Seed(time.Now().UnixNano())
	randomIndex := rand.Intn(len(g.Questions))
	drawnQuestion := g.Questions[randomIndex]
	g.Questions = append(g.Questions[:randomIndex], g.Questions[randomIndex+1:]...)

	return drawnQuestion
}
