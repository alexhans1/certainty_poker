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

	var resp struct {
		CreateGame model.Game
	}
	c.MustPost(`mutation createGame {
		  createGame `+gameQuery+`
		}
		`, &resp)

	if !IsValidUUID(resp.CreateGame.ID) {
		t.Errorf("invalid uuid")
	}
	require.Equal(t, "dealerId", resp.CreateGame.DealerID)

	gameID := resp.CreateGame.ID

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
	})

	t.Run("Start Game", func(t *testing.T) {
		var resp struct {
			StartGame model.Game
		}
		c.MustPost(`mutation startGame($gameId: ID!) {
      startGame(gameId: $gameId) `+gameQuery+`
    }
    `, &resp, client.Var("gameId", gameID))

		require.Equal(t, gameID, resp.StartGame.ID)
	})
}

func IsValidUUID(u string) bool {
	_, err := uuid.Parse(u)
	return err == nil
}
