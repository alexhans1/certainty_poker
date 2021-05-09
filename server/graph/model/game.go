package model

import (
	"errors"
	"math"
	"os"
	"strconv"

	"github.com/alexhans1/certainty_poker/helpers"
)

// CurrentQuestionRound returns the last element of the game's QuestionRounds slice
func (g *Game) CurrentQuestionRound() *QuestionRound {
	return g.QuestionRounds[len(g.QuestionRounds)-1]
}

// RecentQuestionRound returns the last played question round
// If the game is over then this is the same as the current question round
func (g *Game) RecentQuestionRound() *QuestionRound {
	if g.IsOver {
		return g.QuestionRounds[len(g.QuestionRounds)-1]
	}
	return g.QuestionRounds[len(g.QuestionRounds)-2]
}

// IsFinished returns true if there is only one player left in the game
func (g *Game) IsFinished() bool {
	isOver := len(g.Questions) < 1 || len(g.InPlayers()) <= 1
	g.IsOver = isOver
	return isOver
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
		IsShowdown:      false,
		RevealedGuesses: make([]string, 0),
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
		ID:     helpers.CreateID(),
		Money:  100,
		Name:   name,
		Game:   g,
		IsDead: false,
	}
	g.Players = append(g.Players, newPlayer)
	return newPlayer
}

// RemovePlayer adds a new player
func (g *Game) RemovePlayer(playerID string) {
	remainingPlayers := []*Player{}

	if g.HasStarted() {
		cqr := g.CurrentQuestionRound()
		cbr := cqr.CurrentBettingRound()

		if playerID == cbr.CurrentPlayer.ID {
			cbr.MoveToNextPlayer()
		}

		if playerID == g.DealerID {
			g.DealerID = g.Dealer().FindNextInPlayer().ID
		}

		for _, br := range cqr.BettingRounds {
			for i, bet := range br.Bets {
				if bet.PlayerID == playerID {
					br.Bets = append(br.Bets[:i], br.Bets[i+1:]...)
				}
			}
		}

		for i, guess := range cqr.Guesses {
			if guess.PlayerID == playerID {
				cqr.Guesses = append(cqr.Guesses[:i], cqr.Guesses[i+1:]...)
			}
		}
	}

	for _, p := range g.Players {
		if p.ID != playerID {
			remainingPlayers = append(remainingPlayers, p)
		}
	}

	g.Players = remainingPlayers
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

// SmallBlind returns the amout of the small blind depending on the env variable and the number of question rounds
func (g *Game) SmallBlind() int {
	smallBlind, _ := strconv.Atoi(os.Getenv("SMALL_BLIND"))
	doubleEveryNthRound, _ := strconv.ParseFloat(os.Getenv("DOUBLE_EVERY_NTH_ROUND"), 64)
	numberOfQuestionRounds := len(g.QuestionRounds)
	return smallBlind * int(math.Pow(2, math.Floor(float64(numberOfQuestionRounds-1)/doubleEveryNthRound)))
}

// BigBlind returns two times the small blind
func (g *Game) BigBlind() int {
	return g.SmallBlind() * 2
}

// FindGame returns the game with the provided ID
func FindGame(games map[string]*Game, id string) (game *Game, err error) {
	if game, ok := games[id]; ok {
		return game, nil
	}
	return nil, errors.New("Game not found")
}
