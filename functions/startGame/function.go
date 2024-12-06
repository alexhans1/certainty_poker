package startGame

import (
	"encoding/json"
	"net/http"

	"github.com/GoogleCloudPlatform/functions-framework-go/functions"
	"github.com/alexhans1/certainty_poker/functions/startGame/handler"
)

type RequestBody struct {
	GameID string `json:"gameId"`
}

func init() {
	functions.HTTP("startGame", httpHandler)
}

func httpHandler(w http.ResponseWriter, r *http.Request) {
	// extract gameId from request body
	var body RequestBody
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "Invalid JSON body", http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	success, err := handler.StartGame(body.GameID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if success {
		w.WriteHeader(http.StatusOK)
	} else {
		w.WriteHeader(http.StatusInternalServerError)
	}
}
