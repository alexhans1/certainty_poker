package gamelogic

import (
	"errors"

	"github.com/alexhans1/certainty_poker/graph/model"
	"github.com/alexhans1/certainty_poker/helpers"
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

	if bet.Amount == -1 {
		// player folded
		questionRound.FoldedPlayerIds = append(questionRound.FoldedPlayerIds, bet.PlayerID)
		if len(questionRound.FoldedPlayerIds) == len(game.Players)-1 {
			// if there is only one player left, end question round straight away
			if err := startNewQuestionRound(game, questionRound); err != nil {
				return err
			}
			return StartBettingRound(game)
		}
		incrementCurrentPlayer(game, questionRound, bettingRound)
		return nil
	}

	if bet.Amount == 0 {
		incrementCurrentPlayer(game, questionRound, bettingRound)
		return nil
	}

	bettingRound.Bets = append(bettingRound.Bets, &bet)

	player, err := model.FindPlayer(game.Players, bet.PlayerID)
	if err != nil {
		return err
	}
	player.Money = player.Money - bet.Amount

	if err := incrementCurrentPlayer(game, questionRound, bettingRound); err != nil {
		return err
	}
	if err := setLastRaisedPlayerID(bettingRound); err != nil {
		return err
	}

	return nil
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

func incrementCurrentPlayer(game *model.Game, questionRound *model.QuestionRound, bettingRound *model.BettingRound) error {
	for i, player := range game.Players {
		if player.ID == bettingRound.CurrentPlayerID {
			incrementBettingRoundIfOver(game, questionRound, bettingRound)
			bettingRound.CurrentPlayerID = helpers.FindNextNthPlayer(game.Players, i+1, questionRound.FoldedPlayerIds).ID
			return nil
		}
	}
	return errors.New("current player not found in player slice")
}

func incrementBettingRoundIfOver(game *model.Game, questionRound *model.QuestionRound, bettingRound *model.BettingRound) error {
	if bettingRound.CurrentPlayerID == bettingRound.LastRaisedPlayerID {
		questionRound.CurrentBettingRound++
		if questionRound.CurrentBettingRound > len(questionRound.Question.Hints) {
			return startNewQuestionRound(game, questionRound)
		}
		return StartBettingRound(game)
	}
	return nil
}

func startNewQuestionRound(game *model.Game, questionRound *model.QuestionRound) error {
	questionRound.CreateFoldedPlayerIDsSlice(game.Players)
	for i, player := range game.Players {
		if player.ID == game.DealerID {
			game.CurrentQuestionRound++
			if game.CurrentQuestionRound < len(game.QuestionRounds) {
				newQuestionRound := game.QuestionRounds[game.CurrentQuestionRound]
				newQuestionRound.CurrentBettingRound = 0
				newQuestionRound.CreateFoldedPlayerIDsSlice(game.Players)
				game.DealerID = helpers.FindNextNthPlayer(game.Players, i+1, newQuestionRound.FoldedPlayerIds).ID
				return distributePot(game.Players, questionRound)
			}
			return nil
		}
	}
	return errors.New("dealer not found in player slice")
}
