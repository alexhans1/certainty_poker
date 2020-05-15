package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"errors"

	"github.com/alexhans1/certainty_poker/gamelogic"
	"github.com/alexhans1/certainty_poker/graph/generated"
	"github.com/alexhans1/certainty_poker/graph/model"
	"github.com/alexhans1/certainty_poker/helpers"
)

func (r *mutationResolver) CreateGame(ctx context.Context) (*model.Game, error) {
	gameID := helpers.CreateId()
	game := model.Game{
		ID:                   gameID,
		QuestionRounds:       createInitialQuestionRounds(),
		CurrentQuestionRound: -1,
		DealerID:             "dealerId",
		Players:              make([]*model.Player, 0),
	}

	r.games[gameID] = &game

	return &game, nil
}

func (r *mutationResolver) StartGame(ctx context.Context, gameID string) (*model.Game, error) {
	game, err := helpers.FindGame(r.games, gameID)
	if err != nil {
		return nil, err
	}

	if game.CurrentQuestionRound >= 0 {
		return nil, errors.New("cannot start game that is already in progress")
	}

	if len(game.Players) < 2 {
		return nil, errors.New("not enough players to start the game")
	}

	model.ShufflePlayers(game.Players)
	game.DealerID = game.Players[0].ID
	game.CurrentQuestionRound = 0
	game.QuestionRounds[0].CurrentBettingRound = 0

	startBettingRoundErr := gamelogic.StartBettingRound(game)
	if startBettingRoundErr != nil {
		return nil, startBettingRoundErr
	}

	return game, nil
}

func (r *mutationResolver) AddPlayer(ctx context.Context, gameID string) (*model.Player, error) {
	game, err := helpers.FindGame(r.games, gameID)
	if err != nil {
		return nil, err
	}

	if game.CurrentQuestionRound > -1 {
		return nil, errors.New("cannot join game after it started")
	}

	newPlayer := &model.Player{
		ID:    helpers.CreateId(),
		Money: 100,
	}
	game.Players = append(game.Players, newPlayer)
	return newPlayer, nil
}

func (r *mutationResolver) AddGuess(ctx context.Context, input model.GuessInput) (*model.Game, error) {
	game, err := helpers.FindGame(r.games, input.GameID)
	if err != nil {
		return nil, err
	}

	if err := gamelogic.AddGuess(game, input); err != nil {
		return nil, err
	}

	return game, nil
}

func (r *mutationResolver) PlaceBet(ctx context.Context, input model.BetInput) (*model.Game, error) {
	game, err := helpers.FindGame(r.games, input.GameID)
	if err != nil {
		return nil, err
	}

	processBetErr := gamelogic.ProcessBet(game, model.Bet{
		Amount:   input.Amount,
		PlayerID: input.PlayerID,
	})
	if processBetErr != nil {
		return nil, processBetErr
	}

	return game, nil
}

func (r *queryResolver) Game(ctx context.Context, gameID string) (*model.Game, error) {
	return helpers.FindGame(r.games, gameID)
}

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
