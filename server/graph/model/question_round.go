package model

import (
	"errors"
	"math"
	"sort"

	"github.com/alexhans1/certainty_poker/helpers"
)

// CurrentBettingRound returns the last element of the game's QuestionRounds slice
func (q *QuestionRound) CurrentBettingRound() *BettingRound {
	return q.BettingRounds[len(q.BettingRounds)-1]
}

func (q *QuestionRound) inPlayerIDs() []string {
	inPlayerIDs := make([]string, 0)

	for _, playerID := range q.Game.PlayerIds() {
		if !helpers.ContainsString(q.FoldedPlayerIds, playerID) {
			inPlayerIDs = append(inPlayerIDs, playerID)
		}
	}

	return inPlayerIDs
}

func (q *QuestionRound) guessDeviation(PlayerID string) (float64, error) {
	for _, guess := range q.Guesses {
		if guess.PlayerID == PlayerID {
			return math.Abs(q.Question.Answer - guess.Guess), nil
		}
	}
	return -1.0, errors.New("playerID not found in QuestionRound")
}

func (q *QuestionRound) playerBets() map[string]int {
	m := make(map[string]int)
	for _, bettingRound := range q.BettingRounds {
		for _, bet := range bettingRound.Bets {
			if _, ok := m[bet.PlayerID]; ok {
				m[bet.PlayerID] += bet.Amount
			} else {
				m[bet.PlayerID] = bet.Amount
			}
		}
	}

	return m
}

func (q *QuestionRound) rank() [][]string {
	playerIDs := q.inPlayerIDs()
	sort.Slice(playerIDs, func(i, j int) bool {
		a, _ := q.guessDeviation(playerIDs[i])
		b, _ := q.guessDeviation(playerIDs[i])
		return a < b
	})

	result := make([][]string, 0)
	for _, playerID := range playerIDs {
		currentDeviation, _ := q.guessDeviation(playerID)
		previousDeviation, _ := q.guessDeviation(result[len(result)-1][0])

		if (len(result) == 0) || (previousDeviation == currentDeviation) {
			result[len(result)-1] = append(result[len(result)-1], playerID)
		} else {
			rank := make([]string, 0)
			rank[0] = playerID
			result = append(result, rank)
		}
	}

	return result
}

// DistributePot determines who won the question round and allocates the money accordingly
func (q *QuestionRound) DistributePot() int {
	playerBets := q.playerBets()
	rank := q.rank()
	moneyLeft, _ := helpers.MinValueMapStringInt(playerBets, make([]string, 0))

	for moneyLeft > 0 {
		for len(rank[0]) > 0 {
			betSize, _ := helpers.MinValueMapStringInt(playerBets, rank[0])
			potSize := 0

			// Determine size of side pot
			for playerID, amount := range playerBets {
				playerBets[playerID], _ = helpers.MaxInt([]int{amount - betSize, 0})
				contributionToPot, _ := helpers.MaxInt([]int{amount, betSize})
				potSize += contributionToPot
			}
			potShare := potSize / len(rank[0])

			// Distribute money to winners, remove satisfied winners
			unsatisifiedWinnerIDs := make([]string, 0)
			for _, winnerID := range rank[0] {
				winner, _ := FindPlayer(q.Game.Players, winnerID)
				winner.Money += potShare
				if playerBets[winnerID] > 0 {
					unsatisifiedWinnerIDs = append(unsatisifiedWinnerIDs, winnerID)
				}
			}

			rank[0] = unsatisifiedWinnerIDs
		}
		rank = rank[1:]
		moneyLeft, _ = helpers.MinValueMapStringInt(playerBets, make([]string, 0))

	}
	return moneyLeft
}

func (q *QuestionRound) CreateFoldedPlayerIDsSlice(players []*Player) {
	for _, player := range players {
		if !helpers.ContainsString(q.FoldedPlayerIds, player.ID) && player.Money <= 0 {
			q.FoldedPlayerIds = append(q.FoldedPlayerIds, player.ID)
		}
	}
}

// IsFinished returns true if the current betting round is finished and all hints are already revealed
func (q *QuestionRound) IsFinished() bool {
	if len(q.BettingRounds) > len(q.Question.Hints) {
		return q.CurrentBettingRound().IsFinished()
	}
	return false
}

// AddNewBettingRound adds a new betting round
func (q *QuestionRound) AddNewBettingRound() {
	newBettingRound := BettingRound{
		ID:              helpers.CreateID(),
		Bets:            make([]*Bet, 0),
		CurrentPlayerID: "not started",
	}

	inPlayers, _ := q.Game.InPlayers()
	for i, player := range inPlayers {
		if player.ID == q.Game.DealerID {
			newBettingRound.CurrentPlayerID = inPlayers[i+1%len(inPlayers)].ID
			q.BettingRounds = append(q.BettingRounds, &newBettingRound)
			return
		}
	}
}

// Start sets the current and last raised player IDs and places the blinds
func (q *QuestionRound) Start() {
	inPlayers, _ := q.Game.InPlayers()
	for i, player := range inPlayers {
		if player.ID == q.Game.DealerID {
			q.CurrentBettingRound().Raise(&Bet{
				PlayerID: inPlayers[i+1%len(inPlayers)].ID,
				Amount:   5,
			})
			q.CurrentBettingRound().Raise(&Bet{
				PlayerID: inPlayers[i+2%len(inPlayers)].ID,
				Amount:   10,
			})
			q.CurrentBettingRound().CurrentPlayerID = inPlayers[i+3%len(inPlayers)].ID
		}
	}
}

// AddGuess adds to the guesses slice of the question round
func (q *QuestionRound) AddGuess() {
	inPlayers, _ := q.Game.InPlayers()
	for i, player := range inPlayers {
		if player.ID == q.Game.DealerID {
			q.CurrentBettingRound().Raise(&Bet{
				PlayerID: inPlayers[i+1%len(inPlayers)].ID,
				Amount:   5,
			})
			q.CurrentBettingRound().Raise(&Bet{
				PlayerID: inPlayers[i+2%len(inPlayers)].ID,
				Amount:   10,
			})
			q.CurrentBettingRound().CurrentPlayerID = inPlayers[i+3%len(inPlayers)].ID
		}
	}
}

func FindNextNthPlayer(players []*Player, n int, foldedPlayerIDs []string) *Player {
	player := players[n%len(players)]
	if helpers.ContainsString(foldedPlayerIDs, player.ID) {
		return FindNextNthPlayer(players, n+1, foldedPlayerIDs)
	}
	return players[n%len(players)]
}
