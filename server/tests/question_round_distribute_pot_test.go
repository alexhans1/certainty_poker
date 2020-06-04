package tests


import (
  "testing"

  "github.com/alexhans1/certainty_poker/graph/model"
  "github.com/alexhans1/certainty_poker/helpers"
)


func evaluateRank(t *testing.T, questionRound *model.QuestionRound, expectedRank [][]string) {

    rank := questionRound.Rank()

    if !helpers.SliceSliceStringEqual(rank, expectedRank) {
      t.Errorf("rank is wrong: %+v (expected: %+v)", rank, expectedRank)
    }
}


func evaluateDistribution(t *testing.T, questionRound *model.QuestionRound, expectedMoney []int) {
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

  questionRound := testGameFactory(playerMoney, playerBets, playerGuesses, foldedPlayerIDs).QuestionRounds[0]

  expectedRank := [][]string{[]string{"0"}, []string{"1"}}
  expectedMoney:= []int{300, 100}

  evaluateRank(t, questionRound, expectedRank)
  evaluateDistribution(t, questionRound, expectedMoney)
}

func TestAllButOneFolded(t *testing.T) {
  playerGuesses:=[]float64{0, 0, 0}
  playerMoney := []int{100, 100, 100}
  playerBets := []int{100, 100, 100}
  foldedPlayerIDs := []string{"1", "2"}

  questionRound := testGameFactory(playerMoney, playerBets, playerGuesses, foldedPlayerIDs).QuestionRounds[0]

  expectedRank := [][]string{[]string{"0"}}
  expectedMoney:= []int{400, 100, 100}

  evaluateRank(t, questionRound, expectedRank)
  evaluateDistribution(t, questionRound, expectedMoney)
}

func TestCascadingAllIn(t *testing.T) {
  playerGuesses:=[]float64{5, 4, 3, 2, 1}
  playerMoney := []int{1, 0, 0, 0, 0}
  playerBets := []int{5, 4, 3, 2, 1}
  foldedPlayerIDs := []string{}

  questionRound := testGameFactory(playerMoney, playerBets, playerGuesses, foldedPlayerIDs).QuestionRounds[0]

  expectedRank := [][]string{[]string{"4"}, []string{"3"}, []string{"2"}, []string{"1"},[]string{"0"}}
  expectedMoney:= []int{1, 2, 3, 4, 5}

  evaluateRank(t, questionRound, expectedRank)
  evaluateDistribution(t, questionRound, expectedMoney)
}
