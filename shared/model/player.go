package model

import (
	"github.com/alexhans1/certainty_poker/shared/helpers"
)

// MoneyInQuestionRound returns the amount that the player has in the pot of the current question round
func (p *Player) MoneyInQuestionRound() int {
	game := p.Game
	if game == nil {
		panic("Game is nil")
	}

	questionRound := game.CurrentQuestionRound()
	if questionRound == nil {
		panic("Current QuestionRound is nil")
	}

	var m int = 0
	for _, b := range questionRound.BettingRounds {
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

// HasFolded returns true if the player in included in the FoldedPlayerId list of the current QR
func (p *Player) HasFolded() bool {
	return helpers.ContainsString(p.Game.CurrentQuestionRound().FoldedPlayerIds, p.ID)
}

// IsOutGame returns true if the player has no more money left and
// has no chance of winning some in the current question round
func (p *Player) IsOutGame() bool {
	if p.Money > 0 {
		return false
	}
	if p.MoneyInQuestionRound() > 0 && !p.HasFolded() && !p.Game.CurrentQuestionRound().IsOver {
		return false
	}
	p.IsDead = true
	return true
}

// IsActive returns true if the player can win money in current QR
func (p *Player) IsActive() bool {
	return !(p.HasFolded() || p.IsOutGame())
}

// IsActionable returns true if the player can still place bets in current QR
func (p *Player) IsActionable() bool {
	return !(p.HasFolded() || p.IsOutGame() || p.IsAllIn())
}

// IsAllIn returns true if the player has no money left but money in current QR and has not folded
func (p *Player) IsAllIn() bool {
	return !(p.Money > 0 || p.IsOutGame() || p.HasFolded())
}

// FindNextActionablePlayer returns the next neighbour that is actionable
func (p *Player) FindNextActionablePlayer() *Player {
	nextPlayer := p.getNextPlayer()
	if nextPlayer.IsActionable() {
		return nextPlayer
	}
	return nextPlayer.FindNextActionablePlayer()
}

// FindNextInPlayer returns the next neighbor that is active
func (p *Player) FindNextInPlayer() *Player {
	nextPlayer := p.getNextPlayer()
	if !nextPlayer.IsOutGame() {
		return nextPlayer
	}
	return nextPlayer.FindNextInPlayer()
}

func (p *Player) getNextPlayer() *Player {
	players := p.Game.Players
	for i, player := range players {
		if player.ID == p.ID {
			return players[(i+1)%len(players)]
		}
	}
	return nil
}

// FindPlayer finds player by ID in given player slice
func FindPlayer(slice []*Player, id string) (player *Player) {
	for i := range slice {
		if slice[i].ID == id {
			return slice[i]
		}
	}
	return nil
}
