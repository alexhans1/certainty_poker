package gamelogic

import (
	"errors"
	"math"

	"github.com/alexhans1/certainty_poker/helpers"

	"github.com/alexhans1/certainty_poker/graph/model"
)

// StartBettingRound sets the CurrentPlayerID and LastRaisedPlayerID for the start of a betting round
// based on the number of remaining players and the position of the dealer.
// Returns an error if something fails.
func StartBettingRound(game *model.Game) error {
	// TODO: filter out players who have no money left or who have folded yet
	questionRound := game.QuestionRounds[game.CurrentQuestionRound]
	if questionRound == nil {
		return errors.New("currentQuestionRound round not found")
	}
	bettingRound := questionRound.BettingRounds[questionRound.CurrentBettingRound]
	if bettingRound == nil {
		return errors.New("currentBettingRound round not found")
	}
	questionRound.CreateFoldedPlayerIDsSlice(game.Players)

	for i, player := range game.Players {
		if ! helpers.ContainsString(questionRound.FoldedPlayerIds, player.ID) && player.Money <= 0 {
			questionRound.FoldedPlayerIds = append(questionRound.FoldedPlayerIds, player.ID)
		}
		if player.ID == game.DealerID {
			smallBlindPlayer := helpers.FindNextNthPlayer(game.Players, i+1, questionRound.FoldedPlayerIds)
			bigBlindPlayer := helpers.FindNextNthPlayer(game.Players, i+2, questionRound.FoldedPlayerIds)

			// set the CurrentPlayerID to small blind here.
			// ProcessBet will increment this value to the next player
			// and set the LastRaisedPlayerID.
			bettingRound.CurrentPlayerID = smallBlindPlayer.ID

			if questionRound.CurrentBettingRound == 0 {
				var err error
				err = ProcessBet(game, model.Bet{PlayerID: smallBlindPlayer.ID, Amount: int(math.Min(5, float64(smallBlindPlayer.Money)))})
				if err != nil {
					return err
				}
				err = ProcessBet(game, model.Bet{PlayerID: bigBlindPlayer.ID, Amount: int(math.Min(10, float64(bigBlindPlayer.Money)))})
				if err != nil {
					return err
				}
			} else {
				bettingRound.LastRaisedPlayerID = game.DealerID
			}

			return nil
		}
	}
	return errors.New("dealer not found in player slice")
}
