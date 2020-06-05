package tests


import (
  "testing"

  "github.com/alexhans1/certainty_poker/graph/model"
  "github.com/alexhans1/certainty_poker/helpers"
)

func evaluateInPlayerIDs(t *testing.T, game *model.Game, expectedInPlayerIDs []string) {
    inPlayerIds := make([]string, 0)
    for _, player := range game.InPlayers() {
      inPlayerIds = append(inPlayerIds, player.ID)
    }

    if !helpers.SliceStringEqual(inPlayerIds, expectedInPlayerIDs) {
      t.Errorf("IDs of Game.InPlayers() wrong: %+v (expected: %+v)", inPlayerIds, expectedInPlayerIDs)
    }
}

func evaluateActivePlayerIDs(t *testing.T, game *model.Game, expectedActivePlayerIDs []string) {
  activePlayerIds := make([]string, 0)
  for _, player := range game.ActivePlayers() {
    activePlayerIds = append(activePlayerIds, player.ID)
  }

  if !helpers.SliceStringEqual(activePlayerIds, expectedActivePlayerIDs) {
    t.Errorf("IDs of Game.ActivePlayers() wrong: %+v (expected: %+v)", activePlayerIds, expectedActivePlayerIDs)
  }
}


// All Players in Game and active
func TestAllPlayersActive(t *testing.T) {
  playerMoney := []int{100, 100, 100}
  playerBets := []int{100, 100, 100}
  playerGuesses := []float64{0, 0, 0}
  foldedPlayerIDs := make([]string, 0)

  expectedInPlayerIDs := []string{"0", "1", "2"}
  expectedActivePlayerIDs := []string{"0", "1", "2"}

  game := testGameFactory(playerMoney, playerBets, playerGuesses, foldedPlayerIDs)

  evaluateInPlayerIDs(t, game, expectedInPlayerIDs)
  evaluateActivePlayerIDs(t, game, expectedActivePlayerIDs)
}

// One Player all in, all others in Game and active
func TestOnePlayerAllIn(t *testing.T) {
  playerMoney := []int{100, 100, 0}
  playerBets := []int{100, 100, 100}
  playerGuesses := []float64{0, 0, 0}
  foldedPlayerIDs := make([]string, 0)

  expectedInPlayerIDs := []string{"0", "1", "2"}
  expectedActivePlayerIDs := []string{"0", "1", "2"}

  game := testGameFactory(playerMoney, playerBets, playerGuesses, foldedPlayerIDs)

  evaluateInPlayerIDs(t, game, expectedInPlayerIDs)
  evaluateActivePlayerIDs(t, game, expectedActivePlayerIDs)
}


// One Player out, all others in Game and active
func TestOnePlayerOut(t *testing.T) {
  playerMoney := []int{100, 100, 0}
  playerBets := []int{100, 100, 0}
  playerGuesses := []float64{0, 0, 0}
  foldedPlayerIDs := make([]string, 0)

  expectedInPlayerIDs := []string{"0", "1",}
  expectedActivePlayerIDs := []string{"0", "1"}

  game := testGameFactory(playerMoney, playerBets, playerGuesses, foldedPlayerIDs)

  evaluateInPlayerIDs(t, game, expectedInPlayerIDs)
  evaluateActivePlayerIDs(t, game, expectedActivePlayerIDs)
}


// One Player folded, all others in Game and active
func TestOnePlayerFolded(t *testing.T) {
  playerMoney := []int{100, 100, 100}
  playerBets := []int{100, 100, 100}
  playerGuesses := []float64{0, 0, 0}
  foldedPlayerIDs := []string{"2"}

  expectedInPlayerIDs := []string{"0", "1", "2"}
  expectedActivePlayerIDs := []string{"0", "1"}

  game := testGameFactory(playerMoney, playerBets, playerGuesses, foldedPlayerIDs)

  evaluateInPlayerIDs(t, game, expectedInPlayerIDs)
  evaluateActivePlayerIDs(t, game, expectedActivePlayerIDs)
}
