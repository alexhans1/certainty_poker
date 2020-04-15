package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"

	"github.com/alexhans1/certainty_poker/graph/generated"
	"github.com/alexhans1/certainty_poker/graph/model"
	"github.com/google/uuid"
)

func (r *mutationResolver) CreateGame(ctx context.Context) (*model.Game, error) {
	game := &model.Game{
		ID:                   uuid.New().String(),
		QuestionRounds:       make([]*model.QuestionRound, 0),
		CurrentQuestionRound: -1,
		DealerID:             "dealerId",
		Players:              make([]*model.Player, 0),
	}
	r.games = append(r.games, game)
	return game, nil
}

func (r *queryResolver) Games(ctx context.Context) ([]*model.Game, error) {
	return r.games, nil
}

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
