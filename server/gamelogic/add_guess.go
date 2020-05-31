package gamelogic

import (
	"errors"

	"github.com/alexhans1/certainty_poker/graph/model"
	"github.com/alexhans1/certainty_poker/helpers"
)

// AddGuess adds to the Guess slice of the current question round
func AddGuess(game *model.Game, input model.GuessInput) error {
	questionRound := game.CurrentQuestionRound()
	if helpers.ContainsString(questionRound.FoldedPlayerIds, input.PlayerID) {
		// at the start of each new question round all players with no money left are being added to
		// the FoldedPlayerIds slice. so we can check for that here
		return errors.New("cannot add guess from player without money")
	}
	newGuess := &model.Guess{
		Guess:    input.Guess,
		PlayerID: input.PlayerID,
	}
	questionRound.Guesses = append(questionRound.Guesses, newGuess)
	return nil
}
