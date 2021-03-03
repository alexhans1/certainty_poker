// Code generated by github.com/99designs/gqlgen, DO NOT EDIT.

package model

import (
	"fmt"
	"io"
	"strconv"
)

type Answer struct {
	Numerical *float64       `json:"numerical"`
	Geo       *GeoCoordinate `json:"geo"`
	Order     []string       `json:"order"`
}

type AnswerInputType struct {
	Numerical *float64            `json:"numerical"`
	Geo       *GeoCoordinateInput `json:"geo"`
	Order     []string            `json:"order"`
}

type Bet struct {
	PlayerID string `json:"playerId"`
	Amount   int    `json:"amount"`
}

type BetInput struct {
	GameID   string `json:"gameId"`
	PlayerID string `json:"playerId"`
	Amount   int    `json:"amount"`
}

type BettingRound struct {
	QuestionRound *QuestionRound `json:"questionRound"`
	Bets          []*Bet         `json:"bets"`
	CurrentPlayer *Player        `json:"currentPlayer"`
}

type Game struct {
	ID             string           `json:"id"`
	Players        []*Player        `json:"players"`
	QuestionRounds []*QuestionRound `json:"questionRounds"`
	DealerID       string           `json:"dealerId"`
	Questions      []*Question      `json:"questions"`
	IsOver         bool             `json:"isOver"`
	SetNames       []string         `json:"setNames"`
}

type GeoCoordinate struct {
	Longitude       float64  `json:"longitude"`
	Latitude        float64  `json:"latitude"`
	ToleranceRadius *float64 `json:"toleranceRadius"`
}

type GeoCoordinateInput struct {
	Longitude       float64  `json:"longitude"`
	Latitude        float64  `json:"latitude"`
	ToleranceRadius *float64 `json:"toleranceRadius"`
}

type Guess struct {
	Guess      *Answer  `json:"guess"`
	PlayerID   string   `json:"playerId"`
	Difference *float64 `json:"difference"`
}

type GuessInput struct {
	GameID   string           `json:"gameId"`
	PlayerID string           `json:"playerId"`
	Guess    *AnswerInputType `json:"guess"`
}

type Player struct {
	ID           string         `json:"id"`
	Money        int            `json:"money"`
	Name         string         `json:"name"`
	Game         *Game          `json:"game"`
	IsDead       bool           `json:"isDead"`
	BettingState *BettingStates `json:"bettingState"`
}

type PlayerInput struct {
	GameID     string `json:"gameId"`
	PlayerName string `json:"playerName"`
}

type Question struct {
	ID                 string        `json:"id"`
	Type               QuestionTypes `json:"type"`
	Question           string        `json:"question"`
	Answer             *Answer       `json:"answer"`
	Alternatives       []string      `json:"alternatives"`
	HiddenAlternatives []string      `json:"hiddenAlternatives"`
	ShuffledOrder      []string      `json:"shuffledOrder"`
	Hints              []string      `json:"hints"`
	Explanation        *string       `json:"explanation"`
}

type QuestionInput struct {
	Question     string           `json:"question"`
	Type         QuestionTypes    `json:"type"`
	Answer       *AnswerInputType `json:"answer"`
	Alternatives []string         `json:"alternatives"`
	Hints        []string         `json:"hints"`
	Explanation  *string          `json:"explanation"`
}

type QuestionRound struct {
	Game            *Game                  `json:"game"`
	Question        *Question              `json:"question"`
	Guesses         []*Guess               `json:"guesses"`
	BettingRounds   []*BettingRound        `json:"bettingRounds"`
	FoldedPlayerIds []string               `json:"foldedPlayerIds"`
	IsOver          bool                   `json:"isOver"`
	IsShowdown      bool                   `json:"isShowdown"`
	Results         []*QuestionRoundResult `json:"results"`
}

type QuestionRoundResult struct {
	PlayerID      string `json:"playerId"`
	ChangeInMoney int    `json:"changeInMoney"`
}

type Set struct {
	SetName           string `json:"setName"`
	NumberOfQuestions int    `json:"numberOfQuestions"`
	IsPrivate         bool   `json:"isPrivate"`
	Language          string `json:"language"`
}

type BettingStates string

const (
	BettingStatesChecked BettingStates = "CHECKED"
	BettingStatesCalled  BettingStates = "CALLED"
	BettingStatesRaised  BettingStates = "RAISED"
)

var AllBettingStates = []BettingStates{
	BettingStatesChecked,
	BettingStatesCalled,
	BettingStatesRaised,
}

func (e BettingStates) IsValid() bool {
	switch e {
	case BettingStatesChecked, BettingStatesCalled, BettingStatesRaised:
		return true
	}
	return false
}

func (e BettingStates) String() string {
	return string(e)
}

func (e *BettingStates) UnmarshalGQL(v interface{}) error {
	str, ok := v.(string)
	if !ok {
		return fmt.Errorf("enums must be strings")
	}

	*e = BettingStates(str)
	if !e.IsValid() {
		return fmt.Errorf("%s is not a valid BettingStates", str)
	}
	return nil
}

func (e BettingStates) MarshalGQL(w io.Writer) {
	fmt.Fprint(w, strconv.Quote(e.String()))
}

type QuestionTypes string

const (
	QuestionTypesNumerical      QuestionTypes = "NUMERICAL"
	QuestionTypesMultipleChoice QuestionTypes = "MULTIPLE_CHOICE"
	QuestionTypesDate           QuestionTypes = "DATE"
	QuestionTypesGeo            QuestionTypes = "GEO"
	QuestionTypesOrder          QuestionTypes = "ORDER"
)

var AllQuestionTypes = []QuestionTypes{
	QuestionTypesNumerical,
	QuestionTypesMultipleChoice,
	QuestionTypesDate,
	QuestionTypesGeo,
	QuestionTypesOrder,
}

func (e QuestionTypes) IsValid() bool {
	switch e {
	case QuestionTypesNumerical, QuestionTypesMultipleChoice, QuestionTypesDate, QuestionTypesGeo, QuestionTypesOrder:
		return true
	}
	return false
}

func (e QuestionTypes) String() string {
	return string(e)
}

func (e *QuestionTypes) UnmarshalGQL(v interface{}) error {
	str, ok := v.(string)
	if !ok {
		return fmt.Errorf("enums must be strings")
	}

	*e = QuestionTypes(str)
	if !e.IsValid() {
		return fmt.Errorf("%s is not a valid QuestionTypes", str)
	}
	return nil
}

func (e QuestionTypes) MarshalGQL(w io.Writer) {
	fmt.Fprint(w, strconv.Quote(e.String()))
}
