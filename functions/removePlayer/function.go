package removePlayer

import (
	"encoding/json"
	"net/http"

	"github.com/GoogleCloudPlatform/functions-framework-go/functions"
	"github.com/alexhans1/certainty_poker/functions/removePlayer/handler"
	cors "github.com/alexhans1/certainty_poker/shared/api"
)

type RequestBody struct {
	Data struct {
		GameID   string `json:"gameId"`
		PlayerID string `json:"playerId"`
	} `json:"data"`
}

func init() {
	functions.HTTP("removePlayer", cors.CorsMiddleware(httpHandler))
}

func httpHandler(w http.ResponseWriter, r *http.Request) {
	// extract gameId from request body
	var body RequestBody
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "Invalid JSON body", http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	success, err := handler.RemovePlayer(body.Data.GameID, body.Data.PlayerID)
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
