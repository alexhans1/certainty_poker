package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"errors"
	"fmt"

	"github.com/alexhans1/certainty_poker/graph/generated"
	"github.com/alexhans1/certainty_poker/graph/model"
	"github.com/alexhans1/certainty_poker/helpers"
)

func (r *mutationResolver) CreateGame(ctx context.Context) (*model.Game, error) {
	gameID := helpers.CreateID()
	game := model.Game{
		ID:             gameID,
		QuestionRounds: make([]*model.QuestionRound, 0),
		Players:        make([]*model.Player, 0),
		DealerID:       "dealerId",
		Questions:      model.LoadQuestions(),
		IsOver:         false,
	}

	r.games[gameID] = &game

	return &game, nil
}

func (r *mutationResolver) StartGame(ctx context.Context, gameID string) (*model.Game, error) {
	game, err := model.FindGame(r.games, gameID)
	if err != nil {
		return nil, err
	}

	if game.HasStarted() {
		return nil, errors.New("cannot start game that is already in progress")
	}

	if len(game.Players) < 2 {
		return nil, errors.New("not enough players to start the game")
	}

	model.ShufflePlayers(game.Players)
	game.AddNewQuestionRound()

	return game, nil
}

func (r *mutationResolver) AddPlayer(ctx context.Context, input model.PlayerInput) (*model.Player, error) {
	game, err := model.FindGame(r.games, input.GameID)
	if err != nil {
		return nil, err
	}

	if game.HasStarted() {
		return nil, errors.New("cannot join game after it started")
	}

	return game.AddNewPlayer(input.PlayerName), nil
}

func (r *mutationResolver) AddGuess(ctx context.Context, input model.GuessInput) (*model.Game, error) {
	game, err := model.FindGame(r.games, input.GameID)
	if err != nil {
		return nil, err
	}

	game.CurrentQuestionRound().AddGuess(model.Guess{
		PlayerID: input.PlayerID,
		Guess:    input.Guess,
	})

	return game, nil
}

func (r *mutationResolver) PlaceBet(ctx context.Context, input model.BetInput) (*model.Game, error) {
	game, err := model.FindGame(r.games, input.GameID)
	if err != nil {
		return nil, err
	}

	questionRound := game.CurrentQuestionRound()
	if len(questionRound.Guesses) < len(game.InPlayers()) {
		return nil, errors.New("not all players have submitted their guess yet")
	}

	if questionRound.CurrentBettingRound().CurrentPlayer.ID != input.PlayerID {
		return nil, errors.New("it's not the player's turn")
	}

	player := model.FindPlayer(game.Players, input.PlayerID)

	if helpers.ContainsString(questionRound.FoldedPlayerIds, player.ID) {
		return nil, errors.New("folded players cannot place another bet in current question round")
	}
	if player.ID == input.PlayerID && player.Money < input.Amount {
		return nil, errors.New("player does not have enough money to place this bet")
	}

	bettingRound := questionRound.CurrentBettingRound()

	if input.Amount == -1 {
		questionRound.Fold(input.PlayerID)
	} else {
		minimumAmount := bettingRound.AmountToCall() - player.MoneyInQuestionRound()
		if input.Amount < minimumAmount && player.Money > input.Amount {
			return nil, errors.New("amount is not enough to call and the player is not all in")
		}
		newBet := model.Bet{
			Amount:   input.Amount,
			PlayerID: input.PlayerID,
		}
		bettingRound.AddBet(&newBet)
	}

	if bettingRound.IsFinished() {
		if questionRound.IsFinished() {
			questionRound.DistributePot()
			if game.IsFinished() {
				fmt.Println("game is finished")
			} else {
				game.AddNewQuestionRound()
			}
		} else {
			questionRound.AddNewBettingRound()
		}
	} else {
		bettingRound.MoveToNextPlayer()
	}

	return game, nil
}

func (r *queryResolver) Game(ctx context.Context, gameID string) (*model.Game, error) {
	return model.FindGame(r.games, gameID)
}

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
