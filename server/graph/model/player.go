package model

import (
	"errors"
	"math/rand"

	"github.com/alexhans1/certainty_poker/helpers"
)

// MoneyInQuestionRound returns the amount that the player has in the pot of the current question round
func (p *Player) MoneyInQuestionRound() int {
	var m int = 0
	for _, b := range p.Game.CurrentQuestionRound().BettingRounds {
		for _, bet := range b.Bets {
			if bet.PlayerID == p.ID {
				m += bet.Amount
			}
		}
	}
	return m
}

// MoneyInBettingRound returns the amount that the player has in the pot of the current betting round
func (p *Player) MoneyInBettingRound() int {
	var m int = 0
	for _, bet := range p.Game.CurrentQuestionRound().CurrentBettingRound().Bets {
		if bet.PlayerID == p.ID {
			m += bet.Amount
		}
	}
	return m
}

// IsOut returns true if the player has no more money left and has no chance of winning some in the current question round
func (p *Player) IsOut() bool {
	return !(p.Money > 0 ||
		(p.MoneyInQuestionRound() > 0 &&
			!helpers.ContainsString(p.Game.CurrentQuestionRound().FoldedPlayerIds, p.ID)))
}

func ShufflePlayers(playerSlice []*Player) {
	for i := range playerSlice {
		j := rand.Intn(i + 1)
		playerSlice[i], playerSlice[j] = playerSlice[j], playerSlice[i]
	}
}

func FindPlayer(slice []*Player, id string) (player *Player, err error) {
	for i := range slice {
		if slice[i].ID == id {
			return slice[i], nil
		}
	}
	return nil, errors.New("Player not found")
}
