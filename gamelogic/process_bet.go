package gamelogic

import (
	"errors"

	"github.com/alexhans1/certainty_poker/graph/helpers"
	"github.com/alexhans1/certainty_poker/graph/model"
)

// ProcessBet is responsible for
// adding a new bet to the bets slice of the current betting round and
// subtracting the placed amount from the money of the player
// Returns an error if something fails.
func ProcessBet(game *model.Game, bet model.Bet) error {
	questionRound := game.QuestionRounds[game.CurrentQuestionRound]
	if questionRound == nil {
		return errors.New("currentQuestionRound not found")
	}

	bettingRound := questionRound.BettingRounds[questionRound.CurrentBettingRound]
	if bettingRound == nil {
		return errors.New("currentBettingRound not found")
	}

	if bettingRound.CurrentPlayerID != bet.PlayerID {
		return errors.New("can only process bets for current player")
	}

	if bet.Amount == 0 {
		incrementCurrentPlayer(game, questionRound, bettingRound, game.Players)
		return nil
	}

	bettingRound.Bets = append(bettingRound.Bets, &bet)

	player, err := helpers.FindPlayer(game.Players, bet.PlayerID)
	if err != nil {
		return err
	}
	player.Money = player.Money - bet.Amount

	if err := incrementCurrentPlayer(game, questionRound, bettingRound, game.Players); err != nil {
		return err
	}
	if err := setLastRaisedPlayerID(bettingRound); err != nil {
		return err
	}

	return nil
}

func incrementCurrentPlayer(game *model.Game, questionRound *model.QuestionRound, bettingRound *model.BettingRound, players []*model.Player) error {
	for i, player := range players {
		if player.ID == bettingRound.CurrentPlayerID {
			incrementBettingRoundIfOver(game, questionRound, bettingRound, players)
			bettingRound.CurrentPlayerID = players[(i+1)%len(players)].ID
			return nil
		}
	}
	return errors.New("current player not found in player slice")
}

func setLastRaisedPlayerID(bettingRound *model.BettingRound) error {
	var largestBet *model.Bet
	largestBet = bettingRound.Bets[0]
	for _, bet := range bettingRound.Bets {
		if bet.Amount > largestBet.Amount {
			largestBet = bet
		}
	}
	if largestBet == nil {
		return errors.New("error while setting LastRaisedPlayerID")
	}
	bettingRound.LastRaisedPlayerID = largestBet.PlayerID
	return nil
}

func incrementBettingRoundIfOver(game *model.Game, questionRound *model.QuestionRound, bettingRound *model.BettingRound, players []*model.Player) error {
	if bettingRound.CurrentPlayerID == bettingRound.LastRaisedPlayerID {
		for i, player := range players {
			if player.ID == game.DealerID {
				questionRound.CurrentBettingRound++
				game.DealerID = players[(i+1)%len(players)].ID
				return StartBettingRound(game)
			}
		}
		return errors.New("dealer not found in player slice")
	}
	return nil
}
