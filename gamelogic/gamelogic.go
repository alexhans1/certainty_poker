package gamelogic

import (
	"errors"

	"github.com/alexhans1/certainty_poker/graph/model"
)

// StartBettingRound sets the CurrentPlayerID and LastRaisedPlayerID for the start of a betting round
// based on the number of remaining players and the position of the dealer.
// Returns an error if something fails.
func StartBettingRound(game *model.Game) error {
	// TODO: what if there are less than three players left?
	// TODO: filter out players who have no money left
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
			bettingRound.CurrentPlayerID = game.Players[(i+3)%len(game.Players)].ID
			bettingRound.LastRaisedPlayerID = game.Players[(i+2)%len(game.Players)].ID

			return nil
		}
	}
	return errors.New("dealer not found in player slice")
}
