package model

import (
  "errors"
  "math"
  "sort"

  "github.com/alexhans1/certainty_poker/helpers"
)


func (q *QuestionRound) Game() *Game {
  // This needs to return the related ("parent") Game of the QuestionRound
}

func (q *QuestionRound) InPlayerIds() []string {
  inPlayerIds := make([]string, 0)

  for _, playerId := range q.Game().PlayerIds(){
    if ! helpers.ContainsString(q.FoldedPlayerIds, playerId) {
      inPlayerIds = append(inPlayerIds, playerId)
    }
  }

  return inPlayerIds
}

func (q *QuestionRound) GuessDeviation(PlayerId string) (float64, error) {
  for _, guess := range q.Guesses {
    if guess.PlayerId == PlayerId {
      return math.Abs(q.Question.Answer - guess.Guess), nil
    }
  }
  return -1.0, errors.New("PlayerId not found in QuestionRound.")
}

func (q *QuestionRound) PlayerBets() map[string]int {
  m := make(map[string]int)
  for _, bettingRound := range q.BettingRounds {
    for _, bet := range bettingRound.Bets {
      if amount, ok := m[bet.PlayerId]; ok {
        m[bet.PlayerId] += bet.Amount
      } else {
        m[bet.PlayerId] = bet.Amount
      }
    }
  }

  return m
}

func (q *QuestionRound) Rank() [][]string {
  playerIds := q.InPlayerIds()
  sort.Slice(playerIds, func (i, j int) bool {
      a, _ := q.GuessDeviation(playerIds[i])
      b, _ := q.GuessDeviation(playerIds[i])
      return a < b
  })

  result := make([][]string, 0)
  for _, playerId := range playerIds {
    currentDeviation, _ := q.GuessDeviation(playerId)
    previousDeviation, _ := q.GuessDeviation(result[len(result) - 1][0])

    if (len(result) == 0) || (previousDeviation == currentDeviation) {
      result[len(result) - 1] = append(result[len(result) - 1], playerId)
    } else {
      rank := make([]string, 0)
      rank[0] = playerId
      result = append(result, rank)
    }
  }

  return result
}


func (q *QuestionRound) DistributePot() {
  playerBets := q.PlayerBets()
  rank := q.Rank()
  moneyLeft, _ := helpers.MinValueMapStringInt(playerBets, make([]string, 0))

  for moneyLeft > 0 {
    for len(rank[0]) > 0 {
      betSize, _ := helpers.MinValueMapStringInt(playerBets, rank[0])
      potSize := 0

      // Determine size of side pot
      for playerId, amount := range playerBets {
        playerBets[playerId], _ = helpers.MaxInt([]int{amount - betSize, 0})
        contributionToPot, _ := helpers.MaxInt([]int {amount, betSize})
        potSize += contributionToPot
      }
      potShare := potSize / len(rank[0])

      // Distribute money to winners, remove satisfied winners
      unsatisifiedWinnerIds := make([]string, 0)
      for _, winnerId := range rank[0] {
        winner, _ := FindPlayer(q.Game().Players, winnerId)
        winner.Money += potShare
        if playerBets[winnerId] > 0 {
          unsatisifiedWinnerIds = append(unsatisifiedWinnerIds, winnerId)
        }
      }

      rank[0] = unsatisifiedWinnerIds
    }
    rank = rank[1:]
    moneyLeft, _ := helpers.MinValueMapStringInt(playerBets, make([]string, 0))
  }
}

func FindQuestionRound(slice []*QuestionRound, index int) (questionRound *QuestionRound, err error) {
	if len(slice) > index {
		return slice[index], nil
	}
	return nil, errors.New("QuestionRound not found")
}

func (q *QuestionRound) CreateFoldedPlayerIdsSlice(players []*Player) {
	for _, player := range players {
		if ! helpers.ContainsString(q.FoldedPlayerIds, player.Id) && player.Money <= 0 {
			q.FoldedPlayerIds = append(q.FoldedPlayerIds, player.Id)
		}
	}
}

func FindNextNthPlayer(players []*Player, n int, foldedPlayerIds []string) *Player {
	player := players[n%len(players)]
	if helpers.ContainsString(foldedPlayerIds, player.Id) {
		return FindNextNthPlayer(players, n+1, foldedPlayerIds)
	}
	return players[n%len(players)]
}
