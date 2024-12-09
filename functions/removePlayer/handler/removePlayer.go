package handler

import (
	"context"
	"log"
	"os"
	"strings"

	"cloud.google.com/go/firestore"
	"github.com/alexhans1/certainty_poker/shared/model"
	"github.com/sirupsen/logrus"
)

func RemovePlayer(gameID string, playerID string) (bool, error) {
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

	game.RemovePlayer(playerID)

	if game.HasStarted() {
		cqr := game.CurrentQuestionRound()
		cbr := cqr.CurrentBettingRound()

		if cbr.IsFinished() {
			if cqr.IsFinished() {
				cqr.DistributePot()
				if game.IsFinished() {
					logger.Info("game is finished after player left the game")
				} else {
					game.AddNewQuestionRound()
				}
			} else {
				cqr.AddNewBettingRound()
			}
		}
	}

	game.Save(ctx, client)

	logger.WithFields(logrus.Fields{
		"game":            game.ID,
		"numberOfPlayers": len(game.Players),
		"participants":    strings.Join(game.Participants()[:], ", "),
	}).Info("player removed")

	return true, nil
}
