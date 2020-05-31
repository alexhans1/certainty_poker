package model

import (
	"errors"

	"github.com/alexhans1/certainty_poker/helpers"
)

// FindBettingRound finds by id
func FindBettingRound(slice []*BettingRound, id string) (bettingRound *BettingRound, err error) {
	for i := range slice {
		if slice[i].ID == id {
			return slice[i], nil
		}
	}
	return nil, errors.New("BettingRound not found")
}

// Fold adds a player to the FoldedPlayerId List of the question round
func (b *BettingRound) Fold(playerID string) {
	if !helpers.ContainsString(b.QuestionRound.FoldedPlayerIds, playerID) {
		b.QuestionRound.FoldedPlayerIds = append(b.QuestionRound.FoldedPlayerIds, playerID)
	}
}

// Call processes the bet
func (b *BettingRound) Call(bet *Bet) {
	for _, player := range b.QuestionRound.Game.Players {
		if player.ID == bet.PlayerID {
			b.Bets = append(b.Bets, bet)
			player.Money -= bet.Amount
		}
	}
}

// Raise processes the bet and sets the last raised player ID
func (b *BettingRound) Raise(bet *Bet) {
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
	inPlayers, _ := b.QuestionRound.Game.InPlayers()
	for i, player := range inPlayers {
		if player.ID == b.CurrentPlayerID {
			b.CurrentPlayerID = inPlayers[i+1%len(inPlayers)].ID
		}
	}
}

// IsFinished returns true if the betting round is over
func (b *BettingRound) IsFinished() bool {
	activePlayers, _ := b.QuestionRound.Game.ActivePlayers()
	amountToCall := b.AmountToCall()
	if amountToCall > 0 {
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
