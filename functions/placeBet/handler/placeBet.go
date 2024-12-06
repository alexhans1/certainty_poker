package handler

import (
	"context"
	"errors"
	"log"
	"os"

	"cloud.google.com/go/firestore"
	"github.com/alexhans1/certainty_poker/shared/helpers"
	"github.com/alexhans1/certainty_poker/shared/model"
	"github.com/sirupsen/logrus"
)

func PlaceBet(gameID string, playerID string, amount int) (bool, error) {
	var logger = logrus.New()

	// Initialize Firestore client from the Firebase app
	ctx := context.Background()
	projectID := os.Getenv("GOOGLE_PROJECT_ID")
	if projectID == "" {
		log.Fatal("GOOGLE_PROJECT_ID environment variable is not set")
	}
	client, err := firestore.NewClientWithDatabase(ctx, projectID, "certainty-poker")
	if err != nil {
		log.Fatalf("Error initializing Firestore client: %v", err)
	}
	defer client.Close()

	game, err := model.FindGame(ctx, client, gameID)
	if err != nil {
		return false, err
	}

	questionRound := game.CurrentQuestionRound()
	if len(questionRound.Guesses) < len(game.InPlayers()) {
		return false, errors.New("not all players have submitted their guess yet")
	}

	if questionRound.CurrentBettingRound().CurrentPlayer.ID != playerID {
		return false, errors.New("it's not the player's turn")
	}

	player := game.FindPlayer(playerID)

	if helpers.ContainsString(questionRound.FoldedPlayerIds, player.ID) {
		return false, errors.New("folded players cannot place another bet in current question round")
	}
	if player.ID == playerID && player.Money < amount {
		return false, errors.New("player does not have enough money to place this bet")
	}

	bettingRound := questionRound.CurrentBettingRound()

	if amount == -1 {
		questionRound.Fold(playerID)
	} else {
		minimumAmount := bettingRound.AmountToCall() - player.MoneyInQuestionRound()
		if amount < minimumAmount && player.Money > amount {
			return false, errors.New("amount is not enough to call and the player is not all in")
		}
		newBet := model.Bet{
			Amount:   amount,
			PlayerID: playerID,
		}
		bettingRound.AddBet(&newBet, false)
	}

	if bettingRound.IsFinished() {
		if questionRound.IsFinished() {
			questionRound.DistributePot()
			if game.IsFinished() {
				logger.WithFields(logrus.Fields{
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

	game.Save(ctx, client)

	return true, nil
}
