package model

import (
	"encoding/json"
	"errors"
	"regexp"
	"strconv"
	"time"
	"strings"

	"github.com/thoas/go-funk"

	"github.com/alexhans1/certainty_poker/helpers"
	"github.com/go-redis/redis"
)

func validateQuestions(questions []*QuestionInput) error {
	for i, q := range questions {
		if q.Type == QuestionTypesNumerical && q.Answer.Numerical == nil {
			return errors.New("\"answer\" cannot be nil for numerical questions at question " + strconv.Itoa(i+1))
		}
		if q.Type == QuestionTypesDate {
			if q.Answer.Numerical == nil {
				return errors.New("\"answer\" cannot be nil for date questions at question " + strconv.Itoa(i+1))
			}
			match, _ := regexp.MatchString(`([12]\d{3}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01]))`, strconv.FormatFloat(*q.Answer.Numerical, 'f', 6, 64))
			if !match {
				return errors.New("\"answer\" must be a valid date for date questions at question " + strconv.Itoa(i+1))
			}
		}
		if q.Type == QuestionTypesGeo && (q.Answer.Geo == nil) {
			return errors.New("\"latitude\" or \"longitude\" cannot be nil for geo questions at question " + strconv.Itoa(i+1))
		}
		if q.Type == QuestionTypesMultipleChoice && !funk.ContainsFloat64([]float64{0, 1, 2, 3}, *q.Answer.Numerical) {
			return errors.New("\"answer\" must be 1, 2, 3 or 4 for multiple choice questions at question " + strconv.Itoa(i+1))
		}
		if q.Type == QuestionTypesMultipleChoice && (q.Alternatives == nil || len(q.Alternatives) < 4) {
			return errors.New("all \"alternatives\" must be set for multiple choice questions at question " + strconv.Itoa(i+1))
		}

		if q.Type == QuestionTypesOrder  && len(strings.Split(q.Answer.Order, ";") < 2){
			return errors.New("\"answer\" must be a string with multiple elements, separated by semicolon")
		}

	}
	return nil
}

// UploadQuestions uploads new questions to redis
func UploadQuestions(
	redisClient *redis.Client,
	setName string,
	questions []*QuestionInput,
	isPrivate bool,
	language string,
) error {
	if !funk.ContainsString([]string{"AF", "AL", "DZ", "AS", "AD", "AO", "AI", "AQ", "AG", "AR", "AM", "AW", "AU", "AT", "AZ", "BS", "BH", "BD", "BB", "BY", "BE", "BZ", "BJ", "BM", "BT", "BO", "BQ", "BA", "BW", "BV", "BR", "IO", "BN", "BG", "BF", "BI", "CV", "KH", "CM", "CA", "KY", "CF", "TD", "CL", "CN", "CX", "CC", "CO", "KM", "CD", "CG", "CK", "CR", "HR", "CU", "CW", "CY", "CZ", "CI", "DK", "DJ", "DM", "DO", "EC", "EG", "SV", "GQ", "ER", "EE", "SZ", "ET", "FK", "FO", "FJ", "FI", "FR", "GF", "PF", "TF", "GA", "GM", "GE", "DE", "GH", "GI", "GR", "GL", "GD", "GP", "GU", "GT", "GG", "GN", "GW", "GY", "HT", "HM", "VA", "HN", "HK", "HU", "IS", "IN", "ID", "IR", "IQ", "IE", "IM", "IL", "IT", "JM", "JP", "JE", "JO", "KZ", "KE", "KI", "KP", "KR", "KW", "KG", "LA", "LV", "LB", "LS", "LR", "LY", "LI", "LT", "LU", "MO", "MG", "MW", "MY", "MV", "ML", "MT", "MH", "MQ", "MR", "MU", "YT", "MX", "FM", "MD", "MC", "MN", "ME", "MS", "MA", "MZ", "MM", "NA", "NR", "NP", "NL", "NC", "NZ", "NI", "NE", "NG", "NU", "NF", "MP", "NO", "OM", "PK", "PW", "PS", "PA", "PG", "PY", "PE", "PH", "PN", "PL", "PT", "PR", "QA", "MK", "RO", "RU", "RW", "RE", "BL", "SH", "KN", "LC", "MF", "PM", "VC", "WS", "SM", "ST", "SA", "SN", "RS", "SC", "SL", "SG", "SX", "SK", "SI", "SB", "SO", "ZA", "GS", "SS", "ES", "LK", "SD", "SR", "SJ", "SE", "CH", "SY", "TW", "TJ", "TZ", "TH", "TL", "TG", "TK", "TO", "TT", "TN", "TR", "TM", "TC", "TV", "UG", "UA", "AE", "GB", "UM", "US", "UY", "UZ", "VU", "VE", "VN", "VG", "VI", "WF", "EH", "YE", "ZM", "ZW", "AX"}, language) {
		return errors.New("invalid country code")
	}
	validationErr := validateQuestions(questions)
	if validationErr != nil {
		return validationErr
	}
	exists := redisClient.Exists(setName)
	if exists.Err() != nil {
		return exists.Err()
	}
	if exists.Val() == 1 {
		return errors.New("a question set already exists by that name")
	}

	type UploadAlternative struct {
		value string
	}
	type UplaodQuestion struct {
		QuestionInput
		Alternatives []UploadAlternative
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
	status3 := redisClient.HSet(setName, "language", language)
	if status3.Err() != nil {
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
		if q.Type == QuestionTypesMultipleChoice {
			q.HiddenAlternatives = []string{}
			// for multiple choice questions we shuffle the answers and
			// make sure the answer still points to the correct one
			answer := q.Alternatives[int(*q.Answer.Numerical)]
			funk.ShuffleString(q.Alternatives)
			for i, alt := range q.Alternatives {
				if alt == answer {
					new := float64(i)
					q.Answer.Numerical = &new
				}
			}
		}
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
	if q.Type == QuestionTypesNumerical ||
		q.Type == QuestionTypesMultipleChoice ||
		q.Type == QuestionTypesDate {
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
