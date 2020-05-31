package model

import (
	"errors"
	"math/rand"
	"strconv"

	"github.com/alexhans1/certainty_poker/helpers"
)

// CurrentQuestionRound returns the last element of the game's QuestionRounds slice
func (g *Game) CurrentQuestionRound() *QuestionRound {
	return g.QuestionRounds[len(g.QuestionRounds)-1]
}

// AddNewQuestionRound adds a new question round
func (g *Game) AddNewQuestionRound() {
	newQuestionRoundIndex := len(g.QuestionRounds) + 1
	hints := make([]string, 0)

	for i := 0; i < 3; i++ {
		hints = append(hints, "Test Hint "+strconv.Itoa(i+1)+" for Question "+strconv.Itoa(newQuestionRoundIndex+1))
	}

	newQuestionRound := QuestionRound{
		ID: helpers.CreateID(),
		Question: &Question{
			ID:       helpers.CreateID(),
			Question: "Test Question " + strconv.Itoa(newQuestionRoundIndex+1),
			Answer:   rand.Float64() * 1000,
			Hints:    hints,
		},
		Guesses:         make([]*Guess, 0),
		BettingRounds:   make([]*BettingRound, 0),
		FoldedPlayerIds: make([]string, 0),
	}

	newQuestionRound.AddNewBettingRound()
	newQuestionRound.Start()

	g.QuestionRounds = append(g.QuestionRounds, &newQuestionRound)
}

// InPlayers returns the players that are still active in the game
func (g *Game) InPlayers() ([]*Player, []string) {
	inPlayers := make([]*Player, 0)
	inPlayerIds := make([]string, 0)

	for _, player := range g.Players {
		if !player.IsOut() {
			inPlayers = append(inPlayers, player)
			inPlayerIds = append(inPlayerIds, player.ID)
		}
	}

	return inPlayers, inPlayerIds
}

// OutPlayers returns the players that are no longer in the game
func (g *Game) OutPlayers() ([]*Player, []string) {
	outPlayers := make([]*Player, 0)
	outPlayerIds := make([]string, 0)

	for _, player := range g.Players {
		if player.IsOut() {
			outPlayers = append(outPlayers, player)
			outPlayerIds = append(outPlayerIds, player.ID)
		}
	}

	return outPlayers, outPlayerIds
}

// ActivePlayers returns the players that are in the game and have not folded in current QR
func (g *Game) ActivePlayers() ([]*Player, []string) {
	activePlayers := make([]*Player, 0)
	activePlayerIds := make([]string, 0)

	for _, player := range g.Players {
		if !player.IsOut() && !helpers.ContainsString(g.CurrentQuestionRound().FoldedPlayerIds, player.ID) {
			activePlayers = append(activePlayers, player)
			activePlayerIds = append(activePlayerIds, player.ID)
		}
	}

	return activePlayers, activePlayerIds
}

// PlayerIds returns a slice of all player IDs
func (g *Game) PlayerIds() []string {
	playerIds := make([]string, 0)
	for _, player := range g.Players {
		playerIds = append(playerIds, player.ID)
	}

	return playerIds
}

// HasStarted returns true if there are 1 or more question rounds already
func (g *Game) HasStarted() bool {
	return len(g.QuestionRounds) > 0
}

// FindGame returns the game with the provided ID
func FindGame(games map[string]*Game, id string) (game *Game, err error) {
	if game, ok := games[id]; ok {
		return game, nil
	}
	return nil, errors.New("Game not found")
}
