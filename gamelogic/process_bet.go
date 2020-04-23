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

	bettingRound.Bets = append(bettingRound.Bets, &bet)

	player, err := helpers.FindPlayer(game.Players, bet.PlayerID)
	if err != nil {
		return err
	}

	player.Money = player.Money - bet.Amount

	return nil
}
