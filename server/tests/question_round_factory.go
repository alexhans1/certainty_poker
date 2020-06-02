package tests

import (
  "strconv"
  
  "github.com/alexhans1/certainty_poker/graph/model"
  "github.com/alexhans1/certainty_poker/helpers"
)

// factory for Test QuestionRounds
func questionRoundFactory(playerMoney []int, playerBets[]int, playerGuesses []float64, foldedPlayerIDs []string) *model.QuestionRound {
  game := &model.Game {
    ID:             helpers.CreateID(),
    QuestionRounds: make([]*model.QuestionRound, 0),
    Players:        make([]*model.Player, 0),
    DealerID:       "",
  }

  questionRound := &model.QuestionRound {
      Question: &model.Question{
        Question: "",
        Answer:   0,
        Hints:    make([]string, 0),
      },
      Guesses:         make([]*model.Guess, 0),
      BettingRounds:   make([]*model.BettingRound, 0),
      FoldedPlayerIds: foldedPlayerIDs,
      Game:            game,
    }

  bets := make([]*model.Bet, 0)

  for index, money := range playerMoney {
      playerID := strconv.Itoa(index)

      player := &model.Player {
        		ID:    playerID,
        		Money: money,
        		Game:  game,
      }
      game.Players = append(game.Players, player)

      playerGuess := &model.Guess {
        PlayerID: playerID,
        Guess:    playerGuesses[index],
      }
      questionRound.Guesses = append(questionRound.Guesses, playerGuess)

      playerBet := &model.Bet {
        PlayerID: playerID,
        Amount:   playerBets[index],
      }
      bets = append(bets, playerBet)
    }

  bettingRound := &model.BettingRound {
    Bets: bets,
    QuestionRound:  questionRound,
    CurrentPlayer:  game.Players[0],
  }

  questionRound.BettingRounds = []*model.BettingRound{bettingRound}

  game.QuestionRounds = append(game.QuestionRounds, questionRound)

  return questionRound
}
