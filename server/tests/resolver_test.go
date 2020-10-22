package tests

import (
	"testing"

	"github.com/99designs/gqlgen/client"
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/alexhans1/certainty_poker/graph"
	"github.com/alexhans1/certainty_poker/graph/generated"
	"github.com/alexhans1/certainty_poker/graph/model"
	"github.com/google/uuid"
	"github.com/stretchr/testify/require"
)

var gameQuery string = `
  {
    id
    questionRounds {
      question {
        id
        hints
        answer
        question
      }
      foldedPlayerIds
      bettingRounds {
        currentPlayer {
		  id
		  money
        }
        bets {
          amount
          playerId
        }
      }
      guesses {
        guess
        playerId
      }
    }
    players {
      id
      money
    }
    dealerId
  }
`

func TestGame(t *testing.T) {
	c := client.New(handler.NewDefaultServer(generated.NewExecutableSchema(graph.NewResolver())))

	var gameID string
	var player1ID string
	var player2ID string
	var player3ID string
	var currentPlayer *model.Player

	t.Run("Create Game", func(t *testing.T) {
		var resp struct {
			CreateGame model.Game
		}
		c.MustPost(`mutation createGame {
		  createGame `+gameQuery+`
		}
		`, &resp)

		if !isValidUUID(resp.CreateGame.ID) {
			t.Errorf("invalid uuid")
		}
		require.Equal(t, "dealerId", resp.CreateGame.DealerID)

		gameID = resp.CreateGame.ID
	})
	t.Run("Add Player", func(t *testing.T) {
		var resp struct {
			AddPlayer struct {
				ID    string
				Money int
			}
		}
		c.MustPost(`mutation addPlayer($gameId: ID!) {
			addPlayer(gameId: $gameId) {
				id
				money
			}
		}
		`, &resp, client.Var("gameId", gameID))

		require.Equal(t, 100, resp.AddPlayer.Money)

		player1ID = resp.AddPlayer.ID
	})
	t.Run("Start Game should fail", func(t *testing.T) {
		var resp struct {
			StartGame model.Game
		}
		err := c.Post(`
			mutation startGame($gameId: ID!) {
				startGame(gameId: $gameId) `+gameQuery+`
			}
			`,
			&resp,
			client.Var("gameId", gameID))

		require.EqualError(t, err, "[{\"message\":\"not enough players to start the game\",\"path\":[\"startGame\"]}]")
	})
	t.Run("Add Player", func(t *testing.T) {
		var resp struct {
			AddPlayer struct {
				ID    string
				Money int
			}
		}
		c.MustPost(`mutation addPlayer($gameId: ID!) {
			addPlayer(gameId: $gameId) {
				id
				money
			}
		}
		`, &resp, client.Var("gameId", gameID))

		require.Equal(t, 100, resp.AddPlayer.Money)
		player2ID = resp.AddPlayer.ID
	})
	t.Run("Add Player", func(t *testing.T) {
		var resp struct {
			AddPlayer struct {
				ID    string
				Money int
			}
		}
		c.MustPost(`mutation addPlayer($gameId: ID!) {
			addPlayer(gameId: $gameId) {
				id
				money
			}
		}
		`, &resp, client.Var("gameId", gameID))

		require.Equal(t, 100, resp.AddPlayer.Money)
		player3ID = resp.AddPlayer.ID
	})
	t.Run("Start Game", func(t *testing.T) {
		var resp struct {
			StartGame model.Game
		}
		c.MustPost(`
			mutation startGame($gameId: ID!) {
				startGame(gameId: $gameId) `+gameQuery+`
			}
			`,
			&resp,
			client.Var("gameId", gameID))

		require.Equal(t, gameID, resp.StartGame.ID)
		require.Len(t, resp.StartGame.QuestionRounds, 1)
		require.Len(t, resp.StartGame.QuestionRounds[0].BettingRounds, 1)
		require.Equal(t, "Test Question 1", resp.StartGame.QuestionRounds[0].Question.Question)
		require.NotNil(t, resp.StartGame.CurrentQuestionRound().CurrentBettingRound().CurrentPlayer.ID)
		require.Equal(t, 5, resp.StartGame.CurrentQuestionRound().CurrentBettingRound().Bets[0].Amount)
		require.Equal(t, 10, resp.StartGame.CurrentQuestionRound().CurrentBettingRound().Bets[1].Amount)

		currentPlayer = resp.StartGame.CurrentQuestionRound().CurrentBettingRound().CurrentPlayer
	})

	// First Question Round
	t.Run("Add Guess 1", func(t *testing.T) {
		var resp struct {
			AddGuess model.Game
		}
		c.MustPost(`
			mutation addGuess($input: GuessInput!) {
				addGuess(input: $input) `+gameQuery+`
			}
			`,
			&resp,
			client.Var("input", model.GuessInput{
				GameID:   gameID,
				PlayerID: player1ID,
				Guess:    10,
			}))

		require.Equal(t, float64(10), resp.AddGuess.CurrentQuestionRound().Guesses[0].Guess)
	})
	t.Run("Add Guess 2", func(t *testing.T) {
		var resp struct {
			AddGuess model.Game
		}
		c.MustPost(`
			mutation addGuess($input: GuessInput!) {
				addGuess(input: $input) `+gameQuery+`
			}
			`,
			&resp,
			client.Var("input", model.GuessInput{
				GameID:   gameID,
				PlayerID: player3ID,
				Guess:    15,
			}))

		require.Equal(t, float64(15), resp.AddGuess.CurrentQuestionRound().Guesses[1].Guess)
	})
	t.Run("Place bet should fail because not all players have submitted their guess", func(t *testing.T) {
		var resp struct {
			PlaceBet model.Game
		}
		err := c.Post(`
			mutation placeBet($input: BetInput!) {
				placeBet(input: $input) `+gameQuery+`
			}
			`,
			&resp,
			client.Var("input", model.BetInput{
				GameID:   gameID,
				Amount:   10,
				PlayerID: currentPlayer.ID,
			}))

		require.EqualError(t, err, "[{\"message\":\"not all players have submitted their guess yet\",\"path\":[\"placeBet\"]}]")
	})
	t.Run("Add Guess 3", func(t *testing.T) {
		var resp struct {
			AddGuess model.Game
		}
		c.MustPost(`
			mutation addGuess($input: GuessInput!) {
				addGuess(input: $input) `+gameQuery+`
			}
			`,
			&resp,
			client.Var("input", model.GuessInput{
				GameID:   gameID,
				PlayerID: player2ID,
				Guess:    20,
			}))

		require.Equal(t, float64(20), resp.AddGuess.CurrentQuestionRound().Guesses[2].Guess)
		require.Equal(t, resp.AddGuess.Players[0].ID, currentPlayer.ID)
		require.Equal(t, resp.AddGuess.DealerID, currentPlayer.ID)
	})
	t.Run("Place Bet should fail if player is not current player", func(t *testing.T) {
		var resp struct {
			PlaceBet model.Game
		}
		notCurrentPlayerID := player1ID
		if notCurrentPlayerID == currentPlayer.ID {
			notCurrentPlayerID = player2ID
		}
		err := c.Post(`
			mutation placeBet($input: BetInput!) {
				placeBet(input: $input) `+gameQuery+`
			}
			`,
			&resp,
			client.Var("input", model.BetInput{
				GameID:   gameID,
				Amount:   10,
				PlayerID: notCurrentPlayerID,
			}))

		require.EqualError(t, err, "[{\"message\":\"it's not the player's turn\",\"path\":[\"placeBet\"]}]")
	})
	t.Run("Place Bet should fail if player has less money than placed", func(t *testing.T) {
		var resp struct {
			PlaceBet model.Game
		}
		err := c.Post(`
			mutation placeBet($input: BetInput!) {
				placeBet(input: $input) `+gameQuery+`
			}
			`,
			&resp,
			client.Var("input", model.BetInput{
				GameID:   gameID,
				Amount:   1000,
				PlayerID: currentPlayer.ID,
			}))

		require.EqualError(t, err, "[{\"message\":\"player does not have enough money to place this bet\",\"path\":[\"placeBet\"]}]")
	})
	t.Run("Place Bet should fail if player is betting less than needed to call", func(t *testing.T) {
		var resp struct {
			PlaceBet model.Game
		}
		err := c.Post(`
			mutation placeBet($input: BetInput!) {
				placeBet(input: $input) `+gameQuery+`
			}
			`,
			&resp,
			client.Var("input", model.BetInput{
				GameID:   gameID,
				Amount:   9,
				PlayerID: currentPlayer.ID,
			}))

		require.EqualError(t, err, "[{\"message\":\"amount is not enough to call and the player is not all in\",\"path\":[\"placeBet\"]}]")
	})
	t.Run("Dealer calls", func(t *testing.T) {
		var resp struct {
			PlaceBet model.Game
		}
		c.Post(`
			mutation placeBet($input: BetInput!) {
				placeBet(input: $input) `+gameQuery+`
			}
			`,
			&resp,
			client.Var("input", model.BetInput{
				GameID:   gameID,
				Amount:   10,
				PlayerID: currentPlayer.ID,
			}))

		require.Len(t, resp.PlaceBet.CurrentQuestionRound().CurrentBettingRound().Bets, 3)
		require.Len(t, resp.PlaceBet.CurrentQuestionRound().BettingRounds, 1)
		require.NotEqual(t, resp.PlaceBet.DealerID, resp.PlaceBet.CurrentQuestionRound().CurrentBettingRound().CurrentPlayer.ID)

		currentPlayer = resp.PlaceBet.CurrentQuestionRound().CurrentBettingRound().CurrentPlayer
	})
	t.Run("Small Blind calls", func(t *testing.T) {
		var resp struct {
			PlaceBet model.Game
		}
		c.Post(`
			mutation placeBet($input: BetInput!) {
				placeBet(input: $input) `+gameQuery+`
			}
			`,
			&resp,
			client.Var("input", model.BetInput{
				GameID:   gameID,
				Amount:   5,
				PlayerID: currentPlayer.ID,
			}))

		require.Len(t, resp.PlaceBet.CurrentQuestionRound().CurrentBettingRound().Bets, 4)
		require.Len(t, resp.PlaceBet.CurrentQuestionRound().BettingRounds, 1)

		currentPlayer = resp.PlaceBet.CurrentQuestionRound().CurrentBettingRound().CurrentPlayer
	})
	t.Run("Big Blind raises", func(t *testing.T) {
		var resp struct {
			PlaceBet model.Game
		}
		c.Post(`
			mutation placeBet($input: BetInput!) {
				placeBet(input: $input) `+gameQuery+`
			}
			`,
			&resp,
			client.Var("input", model.BetInput{
				GameID:   gameID,
				Amount:   10,
				PlayerID: currentPlayer.ID,
			}))

		require.Len(t, resp.PlaceBet.CurrentQuestionRound().CurrentBettingRound().Bets, 5)
		require.Len(t, resp.PlaceBet.CurrentQuestionRound().BettingRounds, 1)

		currentPlayer = resp.PlaceBet.CurrentQuestionRound().CurrentBettingRound().CurrentPlayer
	})
	t.Run("Dealer folds", func(t *testing.T) {
		var resp struct {
			PlaceBet model.Game
		}
		c.Post(`
			mutation placeBet($input: BetInput!) {
				placeBet(input: $input) `+gameQuery+`
			}
			`,
			&resp,
			client.Var("input", model.BetInput{
				GameID:   gameID,
				Amount:   -1,
				PlayerID: currentPlayer.ID,
			}))

		require.Len(t, resp.PlaceBet.CurrentQuestionRound().CurrentBettingRound().Bets, 5)
		require.Len(t, resp.PlaceBet.CurrentQuestionRound().BettingRounds, 1)
		require.Equal(t, 90, currentPlayer.Money)

		currentPlayer = resp.PlaceBet.CurrentQuestionRound().CurrentBettingRound().CurrentPlayer
	})
	t.Run("Small Blind calls again", func(t *testing.T) {
		var resp struct {
			PlaceBet model.Game
		}
		c.Post(`
			mutation placeBet($input: BetInput!) {
				placeBet(input: $input) `+gameQuery+`
			}
			`,
			&resp,
			client.Var("input", model.BetInput{
				GameID:   gameID,
				Amount:   10,
				PlayerID: currentPlayer.ID,
			}))

		require.Len(t, resp.PlaceBet.CurrentQuestionRound().CurrentBettingRound().Bets, 0)
		require.Len(t, resp.PlaceBet.CurrentQuestionRound().BettingRounds, 2)

		currentPlayer = resp.PlaceBet.CurrentQuestionRound().CurrentBettingRound().CurrentPlayer
	})
	t.Run("Small Blind checks", func(t *testing.T) {
		var resp struct {
			PlaceBet model.Game
		}
		c.Post(`
			mutation placeBet($input: BetInput!) {
				placeBet(input: $input) `+gameQuery+`
			}
			`,
			&resp,
			client.Var("input", model.BetInput{
				GameID:   gameID,
				Amount:   0,
				PlayerID: currentPlayer.ID,
			}))

		require.Len(t, resp.PlaceBet.CurrentQuestionRound().CurrentBettingRound().Bets, 1)

		currentPlayer = resp.PlaceBet.CurrentQuestionRound().CurrentBettingRound().CurrentPlayer
	})
	t.Run("Big Blind checks", func(t *testing.T) {
		var resp struct {
			PlaceBet model.Game
		}
		c.Post(`
			mutation placeBet($input: BetInput!) {
				placeBet(input: $input) `+gameQuery+`
			}
			`,
			&resp,
			client.Var("input", model.BetInput{
				GameID:   gameID,
				Amount:   0,
				PlayerID: currentPlayer.ID,
			}))

		require.Len(t, resp.PlaceBet.CurrentQuestionRound().CurrentBettingRound().Bets, 0)
		require.Len(t, resp.PlaceBet.CurrentQuestionRound().BettingRounds, 3)

		currentPlayer = resp.PlaceBet.CurrentQuestionRound().CurrentBettingRound().CurrentPlayer
	})
	t.Run("Small Blind goes all in", func(t *testing.T) {
		var resp struct {
			PlaceBet model.Game
		}
		c.Post(`
			mutation placeBet($input: BetInput!) {
				placeBet(input: $input) `+gameQuery+`
			}
			`,
			&resp,
			client.Var("input", model.BetInput{
				GameID:   gameID,
				Amount:   currentPlayer.Money,
				PlayerID: currentPlayer.ID,
			}))

		require.Len(t, resp.PlaceBet.CurrentQuestionRound().CurrentBettingRound().Bets, 1)

		currentPlayer = resp.PlaceBet.CurrentQuestionRound().CurrentBettingRound().CurrentPlayer
	})
	t.Run("Big Blind folds", func(t *testing.T) {
		var resp struct {
			PlaceBet model.Game
		}
		c.Post(`
			mutation placeBet($input: BetInput!) {
				placeBet(input: $input) `+gameQuery+`
			}
			`,
			&resp,
			client.Var("input", model.BetInput{
				GameID:   gameID,
				Amount:   -1,
				PlayerID: currentPlayer.ID,
			}))

		require.Len(t, resp.PlaceBet.CurrentQuestionRound().CurrentBettingRound().Bets, 2)
		require.Len(t, resp.PlaceBet.QuestionRounds, 2)
		require.Equal(t, 80, resp.PlaceBet.Players[0].Money)
		require.Equal(t, 130, resp.PlaceBet.Players[1].Money)
		require.Equal(t, 75, resp.PlaceBet.Players[2].Money)

		currentPlayer = resp.PlaceBet.CurrentQuestionRound().CurrentBettingRound().CurrentPlayer
	})

	// Second Question Round
	t.Run("Add Guesses", func(t *testing.T) {
		var resp struct {
			AddGuess model.Game
		}
		c.MustPost(`
			mutation addGuess($input: GuessInput!) {
				addGuess(input: $input) `+gameQuery+`
			}
			`,
			&resp,
			client.Var("input", model.GuessInput{
				GameID:   gameID,
				PlayerID: player1ID,
				Guess:    -1,
			}))

		require.Equal(t, float64(-1), resp.AddGuess.CurrentQuestionRound().Guesses[0].Guess)

		c.MustPost(`
			mutation addGuess($input: GuessInput!) {
				addGuess(input: $input) `+gameQuery+`
			}
			`,
			&resp,
			client.Var("input", model.GuessInput{
				GameID:   gameID,
				PlayerID: player2ID,
				Guess:    -1,
			}))

		require.Equal(t, float64(-1), resp.AddGuess.CurrentQuestionRound().Guesses[1].Guess)

		c.MustPost(`
			mutation addGuess($input: GuessInput!) {
				addGuess(input: $input) `+gameQuery+`
			}
			`,
			&resp,
			client.Var("input", model.GuessInput{
				GameID:   gameID,
				PlayerID: player3ID,
				Guess:    0,
			}))

		require.Equal(t, float64(0), resp.AddGuess.CurrentQuestionRound().Guesses[2].Guess)
	})
	t.Run("Dealer calls", func(t *testing.T) {
		var resp struct {
			PlaceBet model.Game
		}
		c.Post(`
			mutation placeBet($input: BetInput!) {
				placeBet(input: $input) `+gameQuery+`
			}
			`,
			&resp,
			client.Var("input", model.BetInput{
				GameID:   gameID,
				Amount:   10,
				PlayerID: currentPlayer.ID,
			}))

		require.Len(t, resp.PlaceBet.CurrentQuestionRound().CurrentBettingRound().Bets, 3)
		require.Len(t, resp.PlaceBet.CurrentQuestionRound().BettingRounds, 1)

		currentPlayer = resp.PlaceBet.CurrentQuestionRound().CurrentBettingRound().CurrentPlayer
	})
	t.Run("Small Blind goes all in", func(t *testing.T) {
		var resp struct {
			PlaceBet model.Game
		}
		c.Post(`
			mutation placeBet($input: BetInput!) {
				placeBet(input: $input) `+gameQuery+`
			}
			`,
			&resp,
			client.Var("input", model.BetInput{
				GameID:   gameID,
				Amount:   currentPlayer.Money,
				PlayerID: currentPlayer.ID,
			}))

		require.Len(t, resp.PlaceBet.CurrentQuestionRound().CurrentBettingRound().Bets, 4)
		require.Len(t, resp.PlaceBet.CurrentQuestionRound().BettingRounds, 1)

		currentPlayer = resp.PlaceBet.CurrentQuestionRound().CurrentBettingRound().CurrentPlayer
	})
	t.Run("Big Blind calls", func(t *testing.T) {
		var resp struct {
			PlaceBet model.Game
		}
		c.Post(`
			mutation placeBet($input: BetInput!) {
				placeBet(input: $input) `+gameQuery+`
			}
			`,
			&resp,
			client.Var("input", model.BetInput{
				GameID:   gameID,
				Amount:   70,
				PlayerID: currentPlayer.ID,
			}))

		require.Len(t, resp.PlaceBet.CurrentQuestionRound().CurrentBettingRound().Bets, 5)
		require.Len(t, resp.PlaceBet.CurrentQuestionRound().BettingRounds, 1)

		currentPlayer = resp.PlaceBet.CurrentQuestionRound().CurrentBettingRound().CurrentPlayer
	})
	t.Run("Dealer calls", func(t *testing.T) {
		var resp struct {
			PlaceBet model.Game
		}
		c.Post(`
			mutation placeBet($input: BetInput!) {
				placeBet(input: $input) `+gameQuery+`
			}
			`,
			&resp,
			client.Var("input", model.BetInput{
				GameID:   gameID,
				Amount:   70,
				PlayerID: currentPlayer.ID,
			}))

		require.Len(t, resp.PlaceBet.CurrentQuestionRound().CurrentBettingRound().Bets, 0)
		require.Len(t, resp.PlaceBet.CurrentQuestionRound().BettingRounds, 2)

		currentPlayer = resp.PlaceBet.CurrentQuestionRound().CurrentBettingRound().CurrentPlayer

		require.Equal(t, 10, currentPlayer.Money)
	})
	t.Run("Both check", func(t *testing.T) {
		var resp struct {
			PlaceBet model.Game
		}
		c.Post(`
			mutation placeBet($input: BetInput!) {
				placeBet(input: $input) `+gameQuery+`
			}
			`,
			&resp,
			client.Var("input", model.BetInput{
				GameID:   gameID,
				Amount:   0,
				PlayerID: currentPlayer.ID,
			}))

		require.Len(t, resp.PlaceBet.CurrentQuestionRound().CurrentBettingRound().Bets, 1)
		require.Len(t, resp.PlaceBet.CurrentQuestionRound().BettingRounds, 2)

		currentPlayer = resp.PlaceBet.CurrentQuestionRound().CurrentBettingRound().CurrentPlayer

		c.Post(`
			mutation placeBet($input: BetInput!) {
				placeBet(input: $input) `+gameQuery+`
			}
			`,
			&resp,
			client.Var("input", model.BetInput{
				GameID:   gameID,
				Amount:   0,
				PlayerID: currentPlayer.ID,
			}))

		require.Len(t, resp.PlaceBet.CurrentQuestionRound().CurrentBettingRound().Bets, 0)
		require.Len(t, resp.PlaceBet.CurrentQuestionRound().BettingRounds, 3)

		currentPlayer = resp.PlaceBet.CurrentQuestionRound().CurrentBettingRound().CurrentPlayer
	})
	t.Run("Both check again", func(t *testing.T) {
		var resp struct {
			PlaceBet model.Game
		}
		c.Post(`
			mutation placeBet($input: BetInput!) {
				placeBet(input: $input) `+gameQuery+`
			}
			`,
			&resp,
			client.Var("input", model.BetInput{
				GameID:   gameID,
				Amount:   0,
				PlayerID: currentPlayer.ID,
			}))

		require.Len(t, resp.PlaceBet.CurrentQuestionRound().CurrentBettingRound().Bets, 1)
		require.Len(t, resp.PlaceBet.CurrentQuestionRound().BettingRounds, 3)

		currentPlayer = resp.PlaceBet.CurrentQuestionRound().CurrentBettingRound().CurrentPlayer

		c.Post(`
			mutation placeBet($input: BetInput!) {
				placeBet(input: $input) `+gameQuery+`
			}
			`,
			&resp,
			client.Var("input", model.BetInput{
				GameID:   gameID,
				Amount:   0,
				PlayerID: currentPlayer.ID,
			}))

		require.Len(t, resp.PlaceBet.CurrentQuestionRound().CurrentBettingRound().Bets, 0)
		require.Len(t, resp.PlaceBet.CurrentQuestionRound().BettingRounds, 4)

		currentPlayer = resp.PlaceBet.CurrentQuestionRound().CurrentBettingRound().CurrentPlayer
	})
	t.Run("Both bet 5", func(t *testing.T) {
		var resp struct {
			PlaceBet model.Game
		}
		c.Post(`
			mutation placeBet($input: BetInput!) {
				placeBet(input: $input) `+gameQuery+`
			}
			`,
			&resp,
			client.Var("input", model.BetInput{
				GameID:   gameID,
				Amount:   5,
				PlayerID: currentPlayer.ID,
			}))

		require.Len(t, resp.PlaceBet.CurrentQuestionRound().CurrentBettingRound().Bets, 1)
		require.Len(t, resp.PlaceBet.CurrentQuestionRound().BettingRounds, 4)

		currentPlayer = resp.PlaceBet.CurrentQuestionRound().CurrentBettingRound().CurrentPlayer

		c.Post(`
			mutation placeBet($input: BetInput!) {
				placeBet(input: $input) `+gameQuery+`
			}
			`,
			&resp,
			client.Var("input", model.BetInput{
				GameID:   gameID,
				Amount:   5,
				PlayerID: currentPlayer.ID,
			}))

		require.Len(t, resp.PlaceBet.CurrentQuestionRound().CurrentBettingRound().Bets, 2)
		require.Len(t, resp.PlaceBet.CurrentQuestionRound().BettingRounds, 1)
		require.Len(t, resp.PlaceBet.QuestionRounds, 3)

		currentPlayer = resp.PlaceBet.CurrentQuestionRound().CurrentBettingRound().CurrentPlayer
	})

	// Third Question Round
	t.Run("Add Guesses", func(t *testing.T) {
		var resp struct {
			AddGuess model.Game
		}
		c.MustPost(`
			mutation addGuess($input: GuessInput!) {
				addGuess(input: $input) `+gameQuery+`
			}
			`,
			&resp,
			client.Var("input", model.GuessInput{
				GameID:   gameID,
				PlayerID: player1ID,
				Guess:    -1,
			}))

		require.Equal(t, float64(-1), resp.AddGuess.CurrentQuestionRound().Guesses[0].Guess)

		c.MustPost(`
			mutation addGuess($input: GuessInput!) {
				addGuess(input: $input) `+gameQuery+`
			}
			`,
			&resp,
			client.Var("input", model.GuessInput{
				GameID:   gameID,
				PlayerID: player2ID,
				Guess:    -1,
			}))

		require.Equal(t, float64(-1), resp.AddGuess.CurrentQuestionRound().Guesses[1].Guess)

		c.MustPost(`
			mutation addGuess($input: GuessInput!) {
				addGuess(input: $input) `+gameQuery+`
			}
			`,
			&resp,
			client.Var("input", model.GuessInput{
				GameID:   gameID,
				PlayerID: player3ID,
				Guess:    0,
			}))

		require.Equal(t, float64(0), resp.AddGuess.CurrentQuestionRound().Guesses[2].Guess)
	})
	t.Run("All players go all in", func(t *testing.T) {
		var resp struct {
			PlaceBet model.Game
		}
		c.Post(`
			mutation placeBet($input: BetInput!) {
				placeBet(input: $input) `+gameQuery+`
			}
			`,
			&resp,
			client.Var("input", model.BetInput{
				GameID:   gameID,
				Amount:   currentPlayer.Money,
				PlayerID: currentPlayer.ID,
			}))

		require.Len(t, resp.PlaceBet.CurrentQuestionRound().CurrentBettingRound().Bets, 3)
		require.Len(t, resp.PlaceBet.CurrentQuestionRound().BettingRounds, 1)

		currentPlayer = resp.PlaceBet.CurrentQuestionRound().CurrentBettingRound().CurrentPlayer

		c.Post(`
			mutation placeBet($input: BetInput!) {
				placeBet(input: $input) `+gameQuery+`
			}
			`,
			&resp,
			client.Var("input", model.BetInput{
				GameID:   gameID,
				Amount:   currentPlayer.Money,
				PlayerID: currentPlayer.ID,
			}))

		require.Len(t, resp.PlaceBet.CurrentQuestionRound().CurrentBettingRound().Bets, 4)
		require.Len(t, resp.PlaceBet.CurrentQuestionRound().BettingRounds, 1)

		currentPlayer = resp.PlaceBet.CurrentQuestionRound().CurrentBettingRound().CurrentPlayer

		c.Post(`
			mutation placeBet($input: BetInput!) {
				placeBet(input: $input) `+gameQuery+`
			}
			`,
			&resp,
			client.Var("input", model.BetInput{
				GameID:   gameID,
				Amount:   currentPlayer.Money,
				PlayerID: currentPlayer.ID,
			}))

		require.Len(t, resp.PlaceBet.CurrentQuestionRound().CurrentBettingRound().Bets, 5)
		require.Len(t, resp.PlaceBet.CurrentQuestionRound().BettingRounds, 1)

		currentPlayer = resp.PlaceBet.CurrentQuestionRound().CurrentBettingRound().CurrentPlayer
	})
}

func isValidUUID(u string) bool {
	_, err := uuid.Parse(u)
	return err == nil
}
