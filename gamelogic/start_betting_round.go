package gamelogic

import (
	"errors"

	"github.com/alexhans1/certainty_poker/graph/model"
)

// StartBettingRound sets the CurrentPlayerID and LastRaisedPlayerID for the start of a betting round
// based on the number of remaining players and the position of the dealer.
// Returns an error if something fails.
func StartBettingRound(game *model.Game) error {
	// TODO: filter out players who have no money left or who have folded yet
	for i, player := range game.Players {
		if player.ID == game.DealerID {
			questionRound := game.QuestionRounds[game.CurrentQuestionRound]
			if questionRound == nil {
				return errors.New("currentQuestionRound round not found")
			}
			bettingRound := questionRound.BettingRounds[questionRound.CurrentBettingRound]
			if bettingRound == nil {
				return errors.New("currentBettingRound round not found")
			}

			smallBlindPlayer := game.Players[(i+1)%len(game.Players)]
			bigBlindPlayer := game.Players[(i+2)%len(game.Players)]

			// set the CurrentPlayerID to small blind here.
			// ProcessBet will increment this value to the next player
			// and set the LastRaisedPlayerID.
			bettingRound.CurrentPlayerID = smallBlindPlayer.ID

			var err error
			err = ProcessBet(game, model.Bet{PlayerID: smallBlindPlayer.ID, Amount: 5})
			if err != nil {
				return err
			}
			err = ProcessBet(game, model.Bet{PlayerID: bigBlindPlayer.ID, Amount: 10})
			if err != nil {
				return err
			}

			return nil
		}
	}
	return errors.New("dealer not found in player slice")
}
