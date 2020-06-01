package tests


import (
  "testing"

  "github.com/alexhans1/certainty_poker/graph/model"
  "github.com/alexhans1/certainty_poker/helpers"
)

func evaluateTest(t *testing.T, questionRound *model.QuestionRound, expectedRank [][]string, expectedMoney []int) {

    rank := questionRound.Rank()

    if !helpers.SliceSliceStringEqual(rank, expectedRank) {
      t.Errorf("rank is wrong: %+v (expected: %+v)", rank, expectedRank)
    }

    questionRound.DistributePot()

    money := make([]int, 0)

    for _, player := range questionRound.Game.Players {
      money = append(money, player.Money)
    }

    if !helpers.SliceIntEqual(money, expectedMoney) {
      t.Errorf("money distribution is wrong: %+v (expected: %+v)", money, expectedMoney)
    }
}

func TestOneWinner(t *testing.T) {
  playerGuesses:=[]float64{0, 1}
  playerMoney := []int{100, 100}
  playerBets := []int{100, 100}
  foldedPlayerIDs := make([]string, 0)

  questionRound := questionRoundFactory(playerMoney, playerBets, playerGuesses, foldedPlayerIDs)

  expectedRank := [][]string{[]string{"0"}, []string{"1"}}
  expectedMoney:= []int{300, 100}

  evaluateTest(t, questionRound, expectedRank, expectedMoney)
}
