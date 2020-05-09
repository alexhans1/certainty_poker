package model


func PlayerIndex(players []Player, player Player) int {
  for i := range players {
      if players[i] == player {
        return i
      }
  }
  return -1
}


func PlayerIn(players []Player, player Player) bool {
  for i := range players {
    if players[i] == player {
      return true
    }
  }
  return false
}
