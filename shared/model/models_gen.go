package model

import "time"

type Answer struct {
	Numerical *float64       `firestore:"numerical"`
	Geo       *GeoCoordinate `firestore:"geo"`
}

type Bet struct {
	PlayerID string `firestore:"playerId"`
	Amount   int    `firestore:"amount"`
}

type BettingRound struct {
	QuestionRound *QuestionRound `firestore:"questionRound,omitempty"`
	Bets          []*Bet         `firestore:"bets"`
	CurrentPlayer *Player        `firestore:"currentPlayer"`
}

type Game struct {
	ID             string           `firestore:"id,omitempty"`
	Players        []*Player        `firestore:"players"`
	QuestionRounds []*QuestionRound `firestore:"questionRounds"`
	DealerID       string           `firestore:"dealerId"`
	Questions      []*Question      `firestore:"questions"`
	IsOver         bool             `firestore:"isOver"`
	SetNames       []string         `firestore:"setNames"`
	TTL            time.Time        `firestore:"ttl,omitempty"`
}

type GeoCoordinate struct {
	Longitude       float64  `firestore:"longitude"`
	Latitude        float64  `firestore:"latitude"`
	ToleranceRadius *float64 `firestore:"toleranceRadius,omitempty"`
}

type Guess struct {
	Guess      *Answer  `firestore:"guess"`
	PlayerID   string   `firestore:"playerId"`
	Difference *float64 `firestore:"difference,omitempty"`
}

type Player struct {
	ID           string         `firestore:"id"`
	Money        int            `firestore:"money"`
	Name         string         `firestore:"name"`
	Game         *Game          `firestore:"game,omitempty"`
	IsDead       bool           `firestore:"isDead"`
	BettingState *BettingStates `firestore:"bettingState,omitempty"`
}

type Question struct {
	ID                 string        `firestore:"id,omitempty"`
	Type               QuestionTypes `firestore:"type"`
	Question           string        `firestore:"question"`
	Answer             *Answer       `firestore:"answer"`
	Alternatives       []string      `firestore:"alternatives,omitempty"`
	HiddenAlternatives []string      `firestore:"hiddenAlternatives,omitempty"`
	Hints              []string      `firestore:"hints,omitempty"`
	Explanation        *string       `firestore:"explanation,omitempty"`
}

type QuestionRound struct {
	Game            *Game                  `firestore:"game,omitempty"`
	Question        *Question              `firestore:"question"`
	Guesses         []*Guess               `firestore:"guesses"`
	BettingRounds   []*BettingRound        `firestore:"bettingRounds"`
	FoldedPlayerIds []string               `firestore:"foldedPlayerIds"`
	IsOver          bool                   `firestore:"isOver"`
	IsShowdown      bool                   `firestore:"isShowdown"`
	Results         []*QuestionRoundResult `firestore:"results"`
	RevealedGuesses []string               `firestore:"revealedGuesses"`
}

type QuestionRoundResult struct {
	PlayerID      string `firestore:"playerId"`
	ChangeInMoney int    `firestore:"changeInMoney"`
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

type QuestionTypes string

const (
	QuestionTypesNumerical      QuestionTypes = "NUMERICAL"
	QuestionTypesMultipleChoice QuestionTypes = "MULTIPLE_CHOICE"
	QuestionTypesDate           QuestionTypes = "DATE"
	QuestionTypesGeo            QuestionTypes = "GEO"
)
