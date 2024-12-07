package placeBet

import (
	"encoding/json"
	"net/http"

	"github.com/GoogleCloudPlatform/functions-framework-go/functions"
	"github.com/alexhans1/certainty_poker/functions/placeBet/handler"
)

type RequestBody struct {
	Data struct {
		GameID   string `json:"gameId"`
		PlayerID string `json:"playerId"`
		Amount   int    `json:"amount"`
	} `json:"data"`
}

func init() {
	functions.HTTP("placeBet", corsMiddleware(httpHandler))
}

func corsMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Add CORS headers
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		// Handle preflight OPTIONS requests
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		// Call the next handler
		next(w, r)
	}
}

func httpHandler(w http.ResponseWriter, r *http.Request) {
	// extract gameId, playerId and amount from request body
	var body RequestBody
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "Invalid JSON body", http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	success, err := handler.PlaceBet(body.Data.GameID, body.Data.PlayerID, body.Data.Amount)
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
