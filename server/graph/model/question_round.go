package model

import (
	"errors"
	"math"
	"sort"

	"github.com/alexhans1/certainty_poker/helpers"
	poker "github.com/alexhans1/poker-chip-allocation"
)

// CurrentBettingRound returns the last element of the game's QuestionRounds slice
func (q *QuestionRound) CurrentBettingRound() *BettingRound {
	return q.BettingRounds[len(q.BettingRounds)-1]
}

func (q *QuestionRound) guessDeviation(playerID string) (float64, error) {
	for _, guess := range q.Guesses {
		if guess.PlayerID == playerID {
			return math.Abs(q.Question.Answer - guess.Guess), nil
		}
	}
	return -1.0, errors.New("player not found in QuestionRound")
}

func (q *QuestionRound) playerBets() map[string]int {
	m := make(map[string]int)
	for _, bettingRound := range q.BettingRounds {
		for _, bet := range bettingRound.Bets {
			if _, ok := m[bet.PlayerID]; ok {
				m[bet.PlayerID] += bet.Amount
			} else {
				m[bet.PlayerID] = bet.Amount
			}
		}
	}

	return m
}

// Rank determines who has won the question round
func (q *QuestionRound) Rank() [][]string {
	ranks := make([][]string, 0)
	activePlayers := q.Game.ActivePlayers()

	if len(activePlayers) == 1 {
		return [][]string{{activePlayers[0].ID}}
	}

	sort.Slice(activePlayers, func(i, j int) bool {
		a, _ := q.guessDeviation(activePlayers[i].ID)
		b, _ := q.guessDeviation(activePlayers[j].ID)
		return a < b
	})

	for _, player := range activePlayers {
		currentDeviation, _ := q.guessDeviation(player.ID)

		if len(ranks) == 0 {
			ranks = append(ranks, []string{player.ID})
		} else {
			previousDeviation, _ := q.guessDeviation(ranks[len(ranks)-1][0])

			if previousDeviation == currentDeviation {
				ranks[len(ranks)-1] = append(ranks[len(ranks)-1], player.ID)
			} else {
				newRank := []string{player.ID}
				ranks = append(ranks, newRank)
			}
		}
	}

	return ranks
}

// DistributePot determines winner(s), allocates money accordingly
func (q *QuestionRound) DistributePot() {
	playerBets := q.playerBets()
	rank := q.Rank()

	winnings := poker.Allocate(rank, playerBets)
	for playerID, amountWon := range winnings {
		if amountWon > 0 {
			player := FindPlayer(q.Game.Players, playerID)
			player.Money += amountWon
		}
	}
	q.IsOver = true
}

// Fold adds a player to the FoldedPlayerId List of the question round
func (q *QuestionRound) Fold(playerID string) {
	if !helpers.ContainsString(q.FoldedPlayerIds, playerID) {
		q.FoldedPlayerIds = append(q.FoldedPlayerIds, playerID)
	}
}

// IsFinished returns true if the current betting
// round is finished and all hints are already revealed
// or all players are all in or only one player is still active
func (q *QuestionRound) IsFinished() bool {
	activePlayers := q.Game.ActivePlayers()
	actionablePlayers := q.Game.ActionablePlayers()
	if len(activePlayers) <= 1 {
		return true
	}
	if len(actionablePlayers) <= 1 {
		return true
	}
	if len(q.BettingRounds) > len(q.Question.Hints) {
		return q.CurrentBettingRound().IsFinished()
	}
	return false
}

// AddNewBettingRound adds a new betting round
func (q *QuestionRound) AddNewBettingRound() {
	newBettingRound := &BettingRound{
		Bets:          make([]*Bet, 0),
		CurrentPlayer: nil,
		QuestionRound: q,
	}

	newBettingRound.Start()

	q.BettingRounds = append(q.BettingRounds, newBettingRound)
}

// PlaceBlinds places the small and big blind of the QR
func (q *QuestionRound) PlaceBlinds() {
	dealer := q.Game.Dealer()
	q.CurrentBettingRound().AddBet(&Bet{
		PlayerID: dealer.FindNextInPlayer().ID,
		Amount:   5,
	})
	q.CurrentBettingRound().AddBet(&Bet{
		PlayerID: dealer.FindNextInPlayer().FindNextInPlayer().ID,
		Amount:   10,
	})
}

// AddGuess adds to the guesses slice of the question round
func (q *QuestionRound) AddGuess(guess Guess) error {
	player := FindPlayer(q.Game.InPlayers(), guess.PlayerID)
	if player == nil {
		return errors.New("player is no longer in game")
	}
	for _, g := range q.Guesses {
		if guess.PlayerID == g.PlayerID {
			return errors.New("player has already placed a guess for this question")
		}
	}
	q.Guesses = append(q.Guesses, &guess)
	return nil
}
