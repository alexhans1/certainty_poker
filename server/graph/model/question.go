package model

import (
	"os"
	"io/ioutil"
	"encoding/json"
	"math/rand"
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

// Load Questions from json file
func LoadQuestions() []Question {
	questionsJson, _ := os.Open("questions.json")
	
	defer questionsJson.Close()
	byteValue, _ := ioutil.ReadAll(questionsJson)

	var allQuestions []Question
	json.Unmarshal(byteValue, allQuestions)

	return allQuestions
}

// Draw a random Question which is not burnt yets
func DrawQuestion(burntQuestions []string) *Question {
	allQuestions := LoadQuestions()
	openQuestions := make([]Question, 0)

	for _, question := range(allQuestions){
		if helpers.ContainsString(burntQuestions, question.Question){
			continue
		} else {
			openQuestions = append(openQuestions, question)
		}
	}

	randomIndex := rand.Intn(len(openQuestions))
    drawnQuestion := &openQuestions[randomIndex]

    return drawnQuestion
}