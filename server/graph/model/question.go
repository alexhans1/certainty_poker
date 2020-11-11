package model

import (
	"encoding/json"
	"errors"

	"github.com/alexhans1/certainty_poker/helpers"
	"github.com/go-redis/redis"
)

// UploadQuestions uploads new questions to redis
func UploadQuestions(redisClient *redis.Client, setName string, questions []*QuestionInput) error {
	exists := redisClient.Exists(setName)
	if exists.Err() != nil {
		return exists.Err()
	}
	if exists.Val() == 1 {
		return errors.New("a question set already exists by that name")
	}

	m, err := json.Marshal(questions)
	if err != nil {
		return err
	}
	status := redisClient.Set(setName, string(m), 0)
	if status.Err() != nil {
		return status.Err()
	}
	return nil
}

// LoadQuestions loads the questions a given set from redis db
func LoadQuestions(redisClient *redis.Client, setName string) ([]*Question, error) {
	stringifiedQuestions, err := redisClient.Get(setName).Result()
	if err != nil {
		if err.Error() == "redis: nil" {
			return nil, errors.New("question set not found")
		}
		return nil, err
	}

	var questions []*Question
	json.Unmarshal([]byte(stringifiedQuestions), &questions)
	for _, q := range questions {
		q.ID = helpers.CreateID()
	}

	return questions, nil
}

// DrawQuestion draws a random Question and removes it from the slice
func DrawQuestion(g *Game) *Question {
	drawnQuestion := g.Questions[0]
	g.Questions = g.Questions[1:]

	return drawnQuestion
}
