package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"errors"
	"fmt"

	"github.com/alexhans1/certainty_poker/graph/generated"
	"github.com/alexhans1/certainty_poker/graph/model"
)

func (r *mutationResolver) CreateGame(ctx context.Context) (*model.Game, error) {
	gameID := createID()
	game := &model.Game{
		ID:                   gameID,
		QuestionRounds:       make([]*model.QuestionRound, 0),
		CurrentQuestionRound: -1,
		DealerID:             "dealerId",
		Players:              make([]*model.Player, 0),
	}

	r.games = append(r.games, game)

	return game, nil
}

func (r *mutationResolver) AddPlayer(ctx context.Context, gameID string) (*model.Player, error) {
	playerID := createID()
	player := &model.Player{
		ID:    playerID,
		Money: 100,
	}

	return player, nil
}

func (r *mutationResolver) Guess(ctx context.Context, input model.GuessInput) (*model.Guess, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *mutationResolver) PlaceBet(ctx context.Context, input model.BetInput) (*model.Bet, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *queryResolver) Game(ctx context.Context, gameID string) (*model.Game, error) {
	for _, game := range r.games {
		if game.ID == gameID {
			return game, nil
		}
	}
	return nil, errors.New("not found")
}

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
