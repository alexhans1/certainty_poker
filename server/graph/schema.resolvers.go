package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"errors"

	"github.com/alexhans1/certainty_poker/graph/generated"
	"github.com/alexhans1/certainty_poker/graph/model"
	"github.com/alexhans1/certainty_poker/helpers"
)

func (r *mutationResolver) CreateGame(ctx context.Context) (*model.Game, error) {
	gameID := helpers.CreateID()
	game := model.Game{
		ID:             gameID,
		QuestionRounds: createInitialQuestionRounds(),
		DealerID:       "dealerId",
		Players:        make([]*model.Player, 0),
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
	game.DealerID = game.Players[0].ID
	game.AddNewQuestionRound()

	return game, nil
}

func (r *mutationResolver) AddPlayer(ctx context.Context, gameID string) (*model.Player, error) {
	game, err := model.FindGame(r.games, gameID)
	if err != nil {
		return nil, err
	}

	if game.HasStarted() {
		return nil, errors.New("cannot join game after it started")
	}

	newPlayer := &model.Player{
		ID:    helpers.CreateID(),
		Money: 100,
	}
	game.Players = append(game.Players, newPlayer)
	return newPlayer, nil
}

func (r *mutationResolver) AddGuess(ctx context.Context, input model.GuessInput) (*model.Game, error) {
	game, err := model.FindGame(r.games, input.GameID)
	if err != nil {
		return nil, err
	}

	// if err := gamelogic.AddGuess(game, input); err != nil {
	// 	return nil, err
	// }

	return game, nil
}

func (r *mutationResolver) PlaceBet(ctx context.Context, input model.BetInput) (*model.Game, error) {
	game, err := model.FindGame(r.games, input.GameID)
	if err != nil {
		return nil, err
	}

	questionRound := game.CurrentQuestionRound()
	bettingRound := questionRound.CurrentBettingRound()

	for _, player := range game.Players {
		if helpers.ContainsString(questionRound.FoldedPlayerIds, player.ID) {
			return nil, errors.New("folded players cannot place another bet in current question round")
		}
		if player.ID == input.PlayerID && player.Money < input.Amount {
			return nil, errors.New("player does not have enough money to place this bet")
		}
	}

	player, _ := model.FindPlayer(game.Players, input.PlayerID)

	if input.Amount == -1 {
		bettingRound.Fold(input.PlayerID)
	}

	if input.Amount > 0 {
		newBet := model.Bet{
			Amount:   input.Amount,
			PlayerID: input.PlayerID,
		}
		if input.Amount > bettingRound.AmountToCall() {
			bettingRound.Raise(&newBet)
		} else {
			bettingRound.Call(&newBet)
		}
	}

	bettingRound.MoveToNextPlayer()

	if bettingRound.IsFinished() {
		if questionRound.IsFinished() {
			questionRound.DistributePot()
			game.AddNewQuestionRound()
		} else {
			questionRound.AddNewBettingRound()
		}
		game.CurrentQuestionRound().CurrentBettingRound().StartBettingRound()
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
