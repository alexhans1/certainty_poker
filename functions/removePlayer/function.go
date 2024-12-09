package removePlayer

import (
	"encoding/json"
	"net/http"

	"github.com/GoogleCloudPlatform/functions-framework-go/functions"
	"github.com/alexhans1/certainty_poker/functions/removePlayer/handler"
)

type RequestBody struct {
	Data struct {
		GameID   string `json:"gameId"`
		PlayerID string `json:"playerId"`
	} `json:"data"`
}

func init() {
	functions.HTTP("removePlayer", corsMiddleware(httpHandler))
}

func corsMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Define allowed origins
		allowedOrigins := map[string]bool{
			"http://localhost:8080":           true,
			"https://certainty-poker.web.app": true,
		}

		// Get the Origin header from the request
		origin := r.Header.Get("Origin")

		// Check if the Origin is in the allowed list
		if allowedOrigins[origin] {
			// Add CORS headers for allowed origins
			w.Header().Set("Access-Control-Allow-Origin", origin)
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		} else {
			// Reject requests with disallowed origins for non-OPTIONS requests
			if r.Method != http.MethodOptions {
				http.Error(w, "CORS origin not allowed", http.StatusForbidden)
				return
			}
		}

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
