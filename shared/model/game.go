package model

import (
	"context"
	"fmt"
	"math"

	"cloud.google.com/go/firestore"
	"github.com/alexhans1/certainty_poker/shared/helpers"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

// CurrentQuestionRound returns the last element of the game's QuestionRounds slice
func (g *Game) CurrentQuestionRound() *QuestionRound {
	if len(g.QuestionRounds) == 0 {
		return nil
	}
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
	isOver := len(g.Questions) == len(g.QuestionRounds) || len(g.InPlayers()) <= 1
	g.IsOver = isOver
	return isOver
}

// Dealer returns the dealer player object
func (g *Game) Dealer() *Player {
	return FindPlayer(g.Players, g.DealerID)
}

// Participants returns a slice of all player names
func (g *Game) Participants() []string {
	participants := make([]string, 0)
	for _, player := range g.Players {
		participants = append(participants, player.Name)
	}

	return participants
}

// HasStarted returns true if there are 1 or more question rounds already
func (g *Game) HasStarted() bool {
	return len(g.QuestionRounds) > 0
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

// SmallBlind returns the amout of the small blind depending on the env variable and the number of question rounds
func (g *Game) SmallBlind() int {
	smallBlind := 1
	doubleEveryNthRound := 4
	numberOfQuestionRounds := len(g.QuestionRounds)
	return smallBlind * int(math.Pow(2, math.Floor(float64(numberOfQuestionRounds-1)/float64(doubleEveryNthRound))))
}

// BigBlind returns two times the small blind
func (g *Game) BigBlind() int {
	return g.SmallBlind() * 2
}

func (g *Game) FindPlayer(id string) *Player {
	for _, player := range g.Players {
		if player.ID == id {
			return player
		}
	}
	return nil
}

// FindGame returns the game with the provided ID
func FindGame(ctx context.Context, client *firestore.Client, id string) (*Game, error) {
	// Reference the document in the "games" collection
	docRef := client.Collection("games").Doc(id)

	// Get the document snapshot
	docSnap, err := docRef.Get(ctx)
	if err != nil {
		if status.Code(err) == codes.NotFound {
			return nil, fmt.Errorf("game with ID %s not found", id)
		}
		return nil, err
	}

	// Parse the document into the Game struct
	var game Game
	if err := docSnap.DataTo(&game); err != nil {
		return nil, err
	}

	// Ensure the ID field is populated (Firestore does not include it automatically)
	game.ID = docSnap.Ref.ID
	game.postProcessFromFirestore()

	return &game, nil
}

func (game *Game) postProcessFromFirestore() {
	// Initialize QuestionRounds if nil
	if game.QuestionRounds == nil {
		game.QuestionRounds = []*QuestionRound{}
	} else {
		// Initialize fields in each QuestionRound
		for _, qr := range game.QuestionRounds {
			if qr.Game == nil {
				qr.Game = game
			}
			if qr.FoldedPlayerIds == nil {
				qr.FoldedPlayerIds = []string{}
			}
			if qr.RevealedGuesses == nil {
				qr.RevealedGuesses = []string{}
			}
			if qr.Guesses == nil {
				qr.Guesses = []*Guess{}
			}
			if qr.BettingRounds == nil {
				qr.BettingRounds = []*BettingRound{}
			} else {
				// Initialize fields in each BettingRound
				for _, br := range qr.BettingRounds {
					if br.Bets == nil {
						br.Bets = []*Bet{}
					}
					if br.QuestionRound == nil {
						br.QuestionRound = qr
					}
					if br.CurrentPlayer.Game == nil {
						br.CurrentPlayer.Game = game
					}
				}
			}
		}
	}

	// Initialize Players if nil
	if game.Players == nil {
		game.Players = []*Player{}
	} else {
		// Initialize fields in each Player
		for _, player := range game.Players {
			if player.Game == nil {
				player.Game = game
			}
		}
	}

}

func (g *Game) Save(ctx context.Context, client *firestore.Client) error {
	ref := client.Collection("games").Doc(g.ID)
	// Clean the game object to remove circular references
	cleanedGame := g.clean()

	_, err := ref.Set(ctx, cleanedGame)
	return err
}

func (g *Game) clean() *Game {
	// Create a new Game object
	cleanedGame := *g

	// Clean Players
	var cleanedPlayers []*Player
	for _, player := range g.Players {
		cleanedPlayer := *player
		cleanedPlayer.Game = nil // Remove the circular reference
		cleanedPlayers = append(cleanedPlayers, &cleanedPlayer)
	}
	cleanedGame.Players = cleanedPlayers

	// Clean QuestionRounds
	var cleanedQuestionRounds []*QuestionRound
	for _, qr := range g.QuestionRounds {
		cleanedQR := *qr
		cleanedQR.Game = nil // Remove the circular reference

		// Clean BettingRounds within each QuestionRound
		var cleanedBettingRounds []*BettingRound
		for _, br := range qr.BettingRounds {
			cleanedBR := *br
			cleanedBR.QuestionRound = nil // Remove QuestionRound reference
			if cleanedBR.CurrentPlayer != nil {
				cleanedBR.CurrentPlayer.Game = nil // Remove Player reference
			}
			cleanedBettingRounds = append(cleanedBettingRounds, &cleanedBR)
		}
		cleanedQR.BettingRounds = cleanedBettingRounds

		cleanedQuestionRounds = append(cleanedQuestionRounds, &cleanedQR)
	}
	cleanedGame.QuestionRounds = cleanedQuestionRounds

	return &cleanedGame
}
