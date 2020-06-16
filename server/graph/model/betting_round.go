package model

import (
	"github.com/alexhans1/certainty_poker/helpers"
)

// AddBet processes the bet
func (b *BettingRound) AddBet(bet *Bet) {
	for _, player := range b.QuestionRound.Game.Players {
		if player.ID == bet.PlayerID {
			b.Bets = append(b.Bets, bet)
			player.Money -= bet.Amount
		}
	}
}

// AmountToCall returns the amount to call in the current betting round
func (b *BettingRound) AmountToCall() int {
	if len(b.Bets) == 0 {
		return 0
	}
	maxBettedAmount := 0
	bettedAmountPerPlayer := make(map[string]int)
	for _, bet := range b.Bets {
		bettedAmountPerPlayer[bet.PlayerID] += bet.Amount
	}
	for _, bettedAmount := range bettedAmountPerPlayer {
		if bettedAmount > maxBettedAmount {
			maxBettedAmount = bettedAmount
		}
	}
	return maxBettedAmount
}

// MoveToNextPlayer sets the current player ID. Warning: It expects the current player to still be in the game!
func (b *BettingRound) MoveToNextPlayer() {
	for _, player := range b.QuestionRound.Game.InPlayers() {
		if player.ID == b.CurrentPlayer.ID {
			b.CurrentPlayer = player.FindNextActivePlayer()
		}
	}
}

// IsFinished returns true if the betting round is over
func (b *BettingRound) IsFinished() bool {
	activePlayers := b.QuestionRound.Game.ActivePlayers()
	if len(activePlayers) <= 1 {
		return true
	}
	areAllPlayersAllIn := true
	for _, player := range activePlayers {
		if player.Money > 0 {
			areAllPlayersAllIn = false
		}
	}
	if areAllPlayersAllIn {
		return true
	}
	amountToCall := b.AmountToCall()
	if amountToCall > 0 {
		bigBlindPlayer := b.QuestionRound.Game.BigBlindPlayer()
		if len(b.QuestionRound.BettingRounds) == 1 &&
			amountToCall == 10 &&
			b.CurrentPlayer.FindNextActivePlayer().ID == bigBlindPlayer.ID {
			// if it's the first betting round, the big blind player gets to bet again
			return false
		}
		// if the amount to call is greater than 0, then if an active player has less than that in the pot, the BR is not yet over
		for _, player := range activePlayers {
			if player.MoneyInBettingRound() != amountToCall {
				return false
			}
		}
	} else {
		// if the amount to call is 0, then the BR is over when all active players have checked
		playerIdsOfPlayersThatMadeABet := make([]string, 0)
		for _, bet := range b.Bets {
			if !helpers.ContainsString(playerIdsOfPlayersThatMadeABet, bet.PlayerID) {
				playerIdsOfPlayersThatMadeABet = append(playerIdsOfPlayersThatMadeABet, bet.PlayerID)
			}
		}
		if len(playerIdsOfPlayersThatMadeABet) != len(activePlayers) {
			return false
		}
	}
	return true
}

// Start sets current player id to next active player of dealer
func (b *BettingRound) Start() {
	for _, player := range b.QuestionRound.Game.Players {
		if player.ID == b.QuestionRound.Game.DealerID {
			if len(b.QuestionRound.BettingRounds) <= 1 {
				// in the first betting round the player after the big blind starts
				b.CurrentPlayer = player.FindNextActivePlayer().FindNextActivePlayer().FindNextActivePlayer()
			} else {
				b.CurrentPlayer = player.FindNextActivePlayer()
			}
		}
	}
}
