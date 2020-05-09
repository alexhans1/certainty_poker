package model

import(
  "errors"
)


type Table struct {
    currentPlayer Player
    players []Player
    deadPlayers []Player
}


func (t *Table) PlayerIsDead(player Player) bool {
  return PlayerIn(t.deadPlayers, player)
}


func (t *Table) currentPlayerIndex() int {
  return PlayerIndex(t.players, t.currentPlayer)
}


func (t *Table) nextPlayerIndex() int {
  i := t.currentPlayerIndex()
  if  i < len(t.players) - 1 {
    return i + 1
  }
  return 0
}


func (t *Table) NextPlayer() Player {
  return t.players[t.nextPlayerIndex()]
}


func (t *Table) MoveToNextPlayer() {
  t.currentPlayer = t.NextPlayer()
}


func (t *Table) NextLivingPlayer() (Player, error) {
  nextPlayer := t.NextPlayer()
  counter := 1

  for (t.PlayerIsDead(nextPlayer) == true) {
    nextPlayer := t.NextPlayer()
    counter += 1
    if counter == len(t.players) {
      return nextPlayer, errors.New("Can't get NextLivingPlayer() in Table. All Players in Table are dead.")
    }
  }
  return nextPlayer, nil
}


func (t *Table) MoveToNextLivingPlayer() error {
  nextLivingPlayer, err := t.NextLivingPlayer()
  if err != nil {
    return err
  }
  t.currentPlayer = nextLivingPlayer
  return nil
}
