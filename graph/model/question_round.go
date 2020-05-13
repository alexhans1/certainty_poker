package model

import (
  "errors"
  "math"
  "sort"

  "github.com/alexhans1/certainty_poker/helpers"
)

func (q *QuestionRound) Game() Game {
  // TODO: This must return the Game of the QuestionRound
}

func (q *QuestionRound) InPlayerIds() []string {
  inPlayerIds := make([]string)

  for _, playerId := range q.Game().PlayerIds(){
    if ! helpers.ContainsString(q.FoldedPlayerIds, playerId) {
      inPlayerIds.append(playerId)
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
  sortedPlayerIds := sort.Slice(playerIds, func (i, j int) bool {
      q.GuessDeviation(playerIds[i]) < q.GuessDeviation(playerIds[j])
  })

  result = make([][]int)
  for _, playerId := range playerIds {
    if (len(result) == 0) || (result[len(result - 1)][0] == q.GuessDeviation(playerId)) {
      result[len(result - 1)].append(playerId)
    } else {
      rank := make([]string)
      rank[0] = playerId
      result.append(rank)
    }
  }

  return result
}



func FindQuestionRound(slice []*model.QuestionRound, index int) (questionRound *model.QuestionRound, err error) {
	if len(slice) > index {
		return slice[index], nil
	}
	return nil, errors.New("QuestionRound not found")
}

func (q *QuestionRound) CreateFoldedPlayerIDsSlice(players []*model.Player) {
	for _, player := range players {
		if ! helpers.ContainsString(q.FoldedPlayerIds, player.ID) && player.Money <= 0 {
			questionRound.FoldedPlayerIds = append(q.FoldedPlayerIds, player.ID)
		}
	}
}

func FindNextNthPlayer(players []*model.Player, n int, foldedPlayerIDs []string) *model.Player {
	player := players[n%len(players)]
	if ContainsString(foldedPlayerIDs, player.ID) {
		return FindNextNthPlayer(players, n+1, foldedPlayerIDs)
	}
	return players[n%len(players)]
}
