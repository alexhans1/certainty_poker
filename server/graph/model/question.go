package model

import (
	"encoding/json"
	"errors"
	"time"

	"github.com/alexhans1/certainty_poker/helpers"
	"github.com/go-redis/redis"
)

// UploadQuestions uploads new questions to redis
func UploadQuestions(
	redisClient *redis.Client,
	setName string,
	questions []*QuestionInput,
	isPrivate bool,
) error {
	exists := redisClient.Exists(setName)
	if exists.Err() != nil {
		return exists.Err()
	}
	if exists.Val() == 1 {
		return errors.New("a question set already exists by that name")
	}

	var isPrivateVal string
	if isPrivate {
		isPrivateVal = "1"
	} else {
		isPrivateVal = "0"
	}

	m, err := json.Marshal(questions)
	if err != nil {
		return err
	}
	status1 := redisClient.HSet(setName, "questions", string(m))
	if status1.Err() != nil {
		return status1.Err()
	}
	status2 := redisClient.HSet(setName, "isPrivate", isPrivateVal)
	if status2.Err() != nil {
		return status2.Err()
	}
	if isPrivate {
		// expire private sets after 90 days
		redisClient.Expire(setName, time.Hour*24*30*3)
	}
	return nil
}

// LoadQuestions loads the questions a given set from redis db
func LoadQuestions(redisClient *redis.Client, setName string) ([]*Question, error) {
	stringifiedQuestions, err := redisClient.HGet(setName, "questions").Result()
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

// DrawQuestion draws the next Question and removes it from the slice
func DrawQuestion(g *Game) *Question {
	drawnQuestion := g.Questions[0]
	g.Questions = g.Questions[1:]

	return drawnQuestion
}

// GetGuessForType creates an Answer from an AnswerInputType
func (q *Question) GetGuessForType(g *AnswerInputType) (Answer, error) {
	var guess Answer
	if q.Type == QuestionTypesNumerical {
		guess.Numerical = g.Numerical
		return guess, nil
	}
	if q.Type == QuestionTypesGeo {
		guess.Geo = &GeoCoordinate{
			Latitude:  g.Geo.Latitude,
			Longitude: g.Geo.Longitude,
		}
		return guess, nil
	}
	return guess, errors.New("invalid question type")
}
