package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"errors"

	"github.com/alexhans1/certainty_poker/graph/generated"
	"github.com/alexhans1/certainty_poker/graph/model"
)

func (r *mutationResolver) CreateGame(ctx context.Context) (*model.Game, error) {
	gameID := createID()
	game := &model.Game{
		ID:                   gameID,
		QuestionRounds:       createInitialQuestionRounds(),
		CurrentQuestionRound: -1,
		DealerID:             "dealerId",
		Players:              make([]*model.Player, 0),
	}

	r.games = append(r.games, game)

	return game, nil
}

func (r *mutationResolver) AddPlayer(ctx context.Context, gameID string) (*model.Player, error) {
	if game, ok := findGame(r.games, gameID); ok {
		newPlayer := &model.Player{
			ID:    createID(),
			Money: 100,
		}
		game.Players = append(game.Players, newPlayer)
		return newPlayer, nil
	}

	return nil, errors.New("not found")
}

func (r *mutationResolver) AddGuess(ctx context.Context, input model.GuessInput) (*model.Guess, error) {
	if game, ok := findGame(r.games, input.GameID); ok {
		if questionRound, ok := findQuestionRound(game.QuestionRounds, input.QuestionRoundID); ok {
			newGuess := &model.Guess{
				Guess:    input.Guess,
				PlayerID: input.PlayerID,
			}
			questionRound.Guesses = append(questionRound.Guesses, newGuess)
			return newGuess, nil
		}
	}

	return nil, errors.New("not found")
}

func (r *mutationResolver) PlaceBet(ctx context.Context, input model.BetInput) (*model.Bet, error) {
	if game, ok := findGame(r.games, input.GameID); ok {
		if questionRound, ok := findQuestionRound(game.QuestionRounds, input.QuestionRoundID); ok {
			if bettingRound, ok := findBettingRound(questionRound.BettingRounds, input.BettingRoundID); ok {
				newBet := &model.Bet{
					Amount:   input.Amount,
					PlayerID: input.PlayerID,
				}
				bettingRound.Bets = append(bettingRound.Bets, newBet)
				return newBet, nil
			}
		}
	}

	return nil, errors.New("not found")
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
