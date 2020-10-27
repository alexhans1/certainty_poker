package model

import (
	"errors"

	"github.com/alexhans1/certainty_poker/helpers"
)

// CurrentQuestionRound returns the last element of the game's QuestionRounds slice
func (g *Game) CurrentQuestionRound() *QuestionRound {
	return g.QuestionRounds[len(g.QuestionRounds)-1]
}

// IsFinished returns true if there is only one player left in the game
func (g *Game) IsFinished() bool {
	return len(g.Questions) < 1 || len(g.InPlayers()) <= 1
}

// Dealer returns the dealer player object
func (g *Game) Dealer() *Player {
	return FindPlayer(g.Players, g.DealerID)
}

// SmallBlindPlayer returns the dealer player object
func (g *Game) SmallBlindPlayer() *Player {
	return g.Dealer().FindNextInPlayer()
}

// BigBlindPlayer returns the dealer player object
func (g *Game) BigBlindPlayer() *Player {
	return g.SmallBlindPlayer().FindNextInPlayer()
}

// AddNewQuestionRound adds a new question round
func (g *Game) AddNewQuestionRound() {
	question := DrawQuestion(g)

	newQuestionRound := &QuestionRound{
		Question:        question,
		Guesses:         make([]*Guess, 0),
		BettingRounds:   make([]*BettingRound, 0),
		FoldedPlayerIds: make([]string, 0),
		Game:            g,
		IsOver:          false,
	}
	newQuestionRound.IsOver = false
	g.QuestionRounds = append(g.QuestionRounds, newQuestionRound)

	dealer := g.Dealer()
	if dealer == nil {
		g.DealerID = g.Players[0].ID
	} else {
		g.DealerID = g.Dealer().FindNextInPlayer().ID
	}

	newQuestionRound.AddNewBettingRound()

	newQuestionRound.PlaceBlinds()
}

// AddNewPlayer adds a new player
func (g *Game) AddNewPlayer(name string) *Player {
	newPlayer := &Player{
		ID:    helpers.CreateID(),
		Money: 100,
		Name:  name,
		Game:  g,
	}
	g.Players = append(g.Players, newPlayer)
	return newPlayer
}

// InPlayers returns the players that are not out of the game
func (g *Game) InPlayers() []*Player {
	inPlayers := make([]*Player, 0)

	for _, player := range g.Players {
		if !player.IsOutGame() {
			inPlayers = append(inPlayers, player)
		}
	}

	return inPlayers
}

// OutPlayers returns the players that are no longer in the game
func (g *Game) OutPlayers() ([]*Player, []string) {
	outPlayers := make([]*Player, 0)
	outPlayerIds := make([]string, 0)

	for _, player := range g.Players {
		if player.IsOutGame() {
			outPlayers = append(outPlayers, player)
			outPlayerIds = append(outPlayerIds, player.ID)
		}
	}

	return outPlayers, outPlayerIds
}

// ActivePlayers returns the players that are in the game and have not folded in current QR
func (g *Game) ActivePlayers() []*Player {
	activePlayers := make([]*Player, 0)

	for _, player := range g.Players {
		if player.IsActive() {
			activePlayers = append(activePlayers, player)
		}
	}

	return activePlayers
}

// ActionablePlayers returns the players that are in the game,
// have not folded in current QR and
// are not all in
func (g *Game) ActionablePlayers() []*Player {
	actionablePlayers := make([]*Player, 0)

	for _, player := range g.Players {
		if player.IsActionable() {
			actionablePlayers = append(actionablePlayers, player)
		}
	}

	return actionablePlayers
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
