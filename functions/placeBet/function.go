package placeBet

import (
	"encoding/json"
	"net/http"

	"github.com/GoogleCloudPlatform/functions-framework-go/functions"
	"github.com/alexhans1/certainty_poker/functions/placeBet/handler"
)

type RequestBody struct {
	GameID   string `json:"gameId"`
	PlayerID string `json:"playerId"`
	Amount   int    `json:"amount"`
}

func init() {
	functions.HTTP("placeBet", httpHandler)
}

func httpHandler(w http.ResponseWriter, r *http.Request) {
	// extract gameId, playerId and amount from request body
	var body RequestBody
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "Invalid JSON body", http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	success, err := handler.PlaceBet(body.GameID, body.PlayerID, body.Amount)
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
