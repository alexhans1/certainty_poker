package cors

import "net/http"

func CorsMiddleware(next http.HandlerFunc) http.HandlerFunc {
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
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type, x-firebase-appcheck")
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
