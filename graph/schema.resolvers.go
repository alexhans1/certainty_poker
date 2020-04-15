package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"

	"github.com/alexhans1/certainty_poker/graph/generated"
	"github.com/alexhans1/certainty_poker/graph/model"
	"github.com/google/uuid"
)

func (r *mutationResolver) CreatePlayer(ctx context.Context, input model.NewPlayer) (*model.Player, error) {
	player := &model.Player{
		ID:             uuid.New().String(),
		Name:           input.Name,
		RemainingMoney: 0,
	}
	r.players = append(r.players, player)
	return player, nil
}

func (r *queryResolver) Players(ctx context.Context) ([]*model.Player, error) {
	return r.players, nil
}

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
