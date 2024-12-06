package handler

import (
	"context"
	"errors"
	"log"
	"os"
	"strings"

	"cloud.google.com/go/firestore"
	"github.com/alexhans1/certainty_poker/shared/model"
	"github.com/sirupsen/logrus"
	"github.com/thoas/go-funk"
)

func StartGame(gameID string) (bool, error) {
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

	if game.HasStarted() {
		return false, errors.New("cannot start game that is already in progress")
	}

	if len(game.Players) < 2 {
		return false, errors.New("not enough players to start the game")
	}

	funk.Shuffle(game.Players)
	game.AddNewQuestionRound()

	game.Save(ctx, client)

	logger.WithFields(logrus.Fields{
		"game":            game.ID,
		"numberOfPlayers": len(game.Players),
		"participants":    strings.Join(game.Participants()[:], ", "),
	}).Info("game started")

	return true, nil
}
