package model

import (
	"github.com/alexhans1/certainty_poker/helpers"
)

// AddBet processes the bet
func (b *BettingRound) AddBet(bet *Bet, isBlind bool) {
	for _, player := range b.QuestionRound.Game.Players {
		if player.ID == bet.PlayerID {
			amountToCall := b.AmountToCall() - player.MoneyInQuestionRound()
			b.Bets = append(b.Bets, bet)
			player.Money -= bet.Amount

			// set the BettingState unless the bets are blinds
			if !isBlind {
				if bet.Amount == 0 {
					player.BettingState = &AllBettingStates[0] // checked
					return
				}
				if bet.Amount == amountToCall {
					player.BettingState = &AllBettingStates[1] // called
					return
				}
				if bet.Amount > amountToCall {
					player.BettingState = &AllBettingStates[2] // raised
					// if a player raises, set BettingState of all other players to nil
					for _, p := range b.QuestionRound.Game.Players {
						if p.ID != player.ID {
							p.BettingState = nil
						}
					}
				}
			}
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
			b.CurrentPlayer = player.FindNextActionablePlayer()
			return
		}
	}
}

// IsFinished returns true if the betting round is over
func (b *BettingRound) IsFinished() bool {
	activePlayers := b.QuestionRound.Game.ActivePlayers()
	actionablePlayers := b.QuestionRound.Game.ActionablePlayers()
	if len(activePlayers) <= 1 {
		return true
	}
	if len(actionablePlayers) == 0 {
		return true
	}
	if len(actionablePlayers) == 1 && actionablePlayers[0].ID == b.CurrentPlayer.ID {
		return true
	}
	amountToCall := b.AmountToCall()
	if amountToCall > 0 {
		// if it's the first betting round, the big blind player gets to bet again
		bigBlindPlayer := b.QuestionRound.Game.BigBlindPlayer()
		if len(b.QuestionRound.BettingRounds) == 1 &&
			amountToCall == b.QuestionRound.Game.BigBlind() &&
			b.CurrentPlayer.FindNextActionablePlayer().ID == bigBlindPlayer.ID {
			return false
		}
		// if the amount to call is greater than 0, then if an
		// actionable player has less than that in the pot,
		// the BR is not yet over
		for _, player := range actionablePlayers {
			if player.MoneyInBettingRound() != amountToCall {
				return false
			}
		}
	} else {
		// if the amount to call is 0, then the BR is over when all actionable players have checked
		// or there is only one actionable player left
		if len(actionablePlayers) == 1 {
			return true
		}
		playerIdsOfPlayersThatMadeABet := make([]string, 0)
		for _, bet := range b.Bets {
			if !helpers.ContainsString(playerIdsOfPlayersThatMadeABet, bet.PlayerID) {
				playerIdsOfPlayersThatMadeABet = append(playerIdsOfPlayersThatMadeABet, bet.PlayerID)
			}
		}
		if len(playerIdsOfPlayersThatMadeABet) != len(actionablePlayers) {
			return false
		}
	}
	return true
}

// Start sets current player id to next active player of dealer
// and resets all player states to nil
func (b *BettingRound) Start() {
	for _, player := range b.QuestionRound.Game.Players {
		player.BettingState = nil
		if player.ID == b.QuestionRound.Game.DealerID {
			if len(b.QuestionRound.BettingRounds) <= 1 {
				// in the first betting round the player after the big blind starts
				b.CurrentPlayer = player.FindNextActionablePlayer().FindNextActionablePlayer().FindNextActionablePlayer()
			} else {
				b.CurrentPlayer = player.FindNextActionablePlayer()
			}
		}
	}
}
