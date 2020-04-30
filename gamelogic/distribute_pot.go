package gamelogic

import (
	"errors"
	"math"

	"github.com/alexhans1/certainty_poker/graph/model"
)

func distributePot(players []*model.Player, questionRound *model.QuestionRound) error {
	// first calculate the winner
	var winningPlayer *model.Player
	var bestGuess *model.Guess
	for _, guess := range questionRound.Guesses {
		if math.Abs(questionRound.Question.Answer-guess.Guess) <
			math.Abs(questionRound.Question.Answer-bestGuess.Guess) {
			bestGuess = guess
		}
	}
	if bestGuess == nil {
		return errors.New("error while determining best guess of question round")
	}
	for _, player := range players {
		if player.ID == bestGuess.PlayerID {
			winningPlayer = player
		}
	}
	if winningPlayer == nil {
		return errors.New("error while determining winner of question round")
	}

	// distribute winnings
	for _, bettingRound := range questionRound.BettingRounds {
		for _, bet := range bettingRound.Bets {
			winningPlayer.Money += bet.Amount
		}
	}

	return nil
}
