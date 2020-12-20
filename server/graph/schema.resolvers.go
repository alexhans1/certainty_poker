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
	"github.com/sirupsen/logrus"
	"github.com/thoas/go-funk"
)

func (r *mutationResolver) CreateGame(ctx context.Context, setNames []string) (*model.Game, error) {
	gameQuestions := []*model.Question{}

	for _, setName := range setNames {
		questions, err := model.LoadQuestions(r.redisClient, setName)
		if err != nil {
			return nil, err
		}
		gameQuestions = append(gameQuestions, questions...)
	}

	gameID := helpers.CreateID()
	game := model.Game{
		ID:             gameID,
		QuestionRounds: make([]*model.QuestionRound, 0),
		Players:        make([]*model.Player, 0),
		DealerID:       "dealerId",
		Questions:      gameQuestions,
		IsOver:         false,
	}

	r.games[gameID] = &game

	r.logger.WithFields(logrus.Fields{"game": game.ID}).Info("game created")
	return &game, nil
}

func (r *mutationResolver) StartGame(ctx context.Context, gameID string) (bool, error) {
	game, err := model.FindGame(r.games, gameID)
	if err != nil {
		return false, err
	}

	if game.HasStarted() {
		return false, errors.New("cannot start game that is already in progress")
	}

	if len(game.Players) < 2 {
		return false, errors.New("not enough players to start the game")
	}

	funk.Shuffle(game.Players)
	game.AddNewQuestionRound()

	go updateGameChannel(r, game)

	r.logger.WithFields(logrus.Fields{"game": game.ID}).Info("game started")
	return true, nil
}

func (r *mutationResolver) AddPlayer(ctx context.Context, input model.PlayerInput) (*model.Player, error) {
	game, err := model.FindGame(r.games, input.GameID)
	if err != nil {
		return nil, err
	}

	if game.HasStarted() {
		return nil, errors.New("cannot join game after it started")
	}

	go updateGameChannel(r, game)

	r.logger.WithFields(logrus.Fields{"game": game.ID}).Info("player added")
	return game.AddNewPlayer(input.PlayerName), nil
}

func (r *mutationResolver) RemovePlayer(ctx context.Context, gameID string, playerID string) (bool, error) {
	game, err := model.FindGame(r.games, gameID)
	if err != nil {
		return false, err
	}

	game.RemovePlayer(playerID)

	if game.HasStarted() {
		cqr := game.CurrentQuestionRound()
		cbr := cqr.CurrentBettingRound()

		if cbr.IsFinished() {
			if cqr.IsFinished() {
				cqr.DistributePot()
				if game.IsFinished() {
					fmt.Println("game is finished")
				} else {
					game.AddNewQuestionRound()
				}
			} else {
				cqr.AddNewBettingRound()
			}
		}
	}

	go updateGameChannel(r, game)

	r.logger.WithFields(logrus.Fields{"game": game.ID}).Info("player removed")
	return true, nil
}

func (r *mutationResolver) AddGuess(ctx context.Context, input model.GuessInput) (bool, error) {
	game, err := model.FindGame(r.games, input.GameID)
	if err != nil {
		return false, err
	}

	guess, gErr := game.CurrentQuestionRound().Question.GetGuessForType(input.Guess)
	if gErr != nil {
		return false, gErr
	}
	game.CurrentQuestionRound().AddGuess(model.Guess{
		PlayerID: input.PlayerID,
		Guess:    &guess,
	})

	go updateGameChannel(r, game)

	r.logger.WithFields(logrus.Fields{"game": game.ID}).Info("guess added")
	return true, nil
}

func (r *mutationResolver) PlaceBet(ctx context.Context, input model.BetInput) (bool, error) {
	game, err := model.FindGame(r.games, input.GameID)
	if err != nil {
		return false, err
	}

	questionRound := game.CurrentQuestionRound()
	if len(questionRound.Guesses) < len(game.InPlayers()) {
		return false, errors.New("not all players have submitted their guess yet")
	}

	if questionRound.CurrentBettingRound().CurrentPlayer.ID != input.PlayerID {
		return false, errors.New("it's not the player's turn")
	}

	player := model.FindPlayer(game.Players, input.PlayerID)

	if helpers.ContainsString(questionRound.FoldedPlayerIds, player.ID) {
		return false, errors.New("folded players cannot place another bet in current question round")
	}
	if player.ID == input.PlayerID && player.Money < input.Amount {
		return false, errors.New("player does not have enough money to place this bet")
	}

	bettingRound := questionRound.CurrentBettingRound()

	if input.Amount == -1 {
		questionRound.Fold(input.PlayerID)
	} else {
		minimumAmount := bettingRound.AmountToCall() - player.MoneyInQuestionRound()
		if input.Amount < minimumAmount && player.Money > input.Amount {
			return false, errors.New("amount is not enough to call and the player is not all in")
		}
		newBet := model.Bet{
			Amount:   input.Amount,
			PlayerID: input.PlayerID,
		}
		bettingRound.AddBet(&newBet)
	}

	if bettingRound.IsFinished() {
		if questionRound.IsFinished() {
			r.logger.WithFields(logrus.Fields{
				"game":              game.ID,
				"isShowdown":        questionRound.IsShowdown,
				"playersInShowdown": len(game.ActivePlayers()),
			}).Info("question round is over")
			questionRound.DistributePot()
			if game.IsFinished() {
				r.logger.WithFields(logrus.Fields{
					"game":               game.ID,
					"remainingPlayers":   len(game.ActivePlayers()),
					"currentQuestion":    len(game.QuestionRounds),
					"remainingQuestions": len(game.Questions),
				}).Info("game is over")
			} else {
				game.AddNewQuestionRound()
			}
		} else {
			questionRound.AddNewBettingRound()
		}
	} else {
		bettingRound.MoveToNextPlayer()
	}

	go updateGameChannel(r, game)

	r.logger.WithFields(logrus.Fields{"game": game.ID}).Info("bet placed")
	return true, nil
}

func (r *mutationResolver) UploadQuestions(ctx context.Context, questions []*model.QuestionInput, setName string, isPrivate bool, language string) (bool, error) {
	err := model.UploadQuestions(r.redisClient, setName, questions, isPrivate, language)
	if err != nil {
		return false, err
	}

	r.logger.WithFields(logrus.Fields{
		"setName":   setName,
		"isPrivate": isPrivate,
		"language":  language,
	}).Info("question set uploaded")
	return true, nil
}

func (r *queryResolver) Game(ctx context.Context, gameID string) (*model.Game, error) {
	return model.FindGame(r.games, gameID)
}

func (r *queryResolver) Sets(ctx context.Context, setName *string) ([]*model.Set, error) {
	var sets []*model.Set
	if setName != nil {
		questions, err := model.LoadQuestions(r.redisClient, *setName)
		if err != nil {
			return nil, err
		}
		language := r.redisClient.HGet(*setName, "language")
		if language.Err() != nil {
			return nil, language.Err()
		}
		sets = append(sets, &model.Set{SetName: *setName, NumberOfQuestions: len(questions), Language: language.Val()})
	} else {
		keys := r.redisClient.Keys("*")
		if keys.Err() != nil {
			return nil, keys.Err()
		}
		for _, name := range keys.Val() {
			isPrivate := r.redisClient.HGet(name, "isPrivate")
			if isPrivate.Err() != nil {
				return nil, isPrivate.Err()
			}
			language := r.redisClient.HGet(name, "language")
			if language.Err() != nil {
				return nil, language.Err()
			}
			if isPrivate.Val() == "0" {
				questions, err := model.LoadQuestions(r.redisClient, name)
				if err != nil {
					return nil, err
				}
				sets = append(sets, &model.Set{SetName: name, NumberOfQuestions: len(questions), Language: language.Val()})
			}
		}
	}
	return sets, nil
}

func (r *subscriptionResolver) GameUpdated(ctx context.Context, gameID string, hash string) (<-chan *model.Game, error) {
	// Create new channel for request
	gameChannel := make(chan *model.Game, 1)
	r.mutex.Lock()
	if r.gameChannels[gameID] == nil {
		r.gameChannels[gameID] = map[string]chan *model.Game{}
	}
	r.gameChannels[gameID][hash] = gameChannel
	r.mutex.Unlock()

	// Delete channel when done
	go func() {
		<-ctx.Done()
		r.mutex.Lock()
		delete(r.gameChannels[gameID], hash)
		if len(r.gameChannels[gameID]) == 0 {
			delete(r.gameChannels, gameID)
		}
		r.mutex.Unlock()
	}()

	return gameChannel, nil
}

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

// Subscription returns generated.SubscriptionResolver implementation.
func (r *Resolver) Subscription() generated.SubscriptionResolver { return &subscriptionResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
type subscriptionResolver struct{ *Resolver }
