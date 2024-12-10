package api

import (
	"context"
	"log"
	"net/http"

	firebase "firebase.google.com/go/v4"
)

// AppCheckMiddleware validates App Check tokens
func AppCheckMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := context.Background()

		// Get the App Check token from the request header
		appCheckToken := r.Header.Get("X-Firebase-AppCheck")
		if appCheckToken == "" {
			http.Error(w, "missing App Check token", http.StatusUnauthorized)
			return
		}

		// Initialize Firebase app (singleton recommended in production)
		app, err := firebase.NewApp(ctx, nil)
		if err != nil {
			log.Printf("failed to initialize Firebase app: %v", err)
			http.Error(w, "internal server error", http.StatusInternalServerError)
			return
		}

		// Get App Check client
		client, err := app.AppCheck(ctx)
		if err != nil {
			log.Printf("failed to get App Check client: %v", err)
			http.Error(w, "internal server error", http.StatusInternalServerError)
			return
		}

		// Verify the App Check token
		_, err = client.VerifyToken(appCheckToken)
		if err != nil {
			log.Printf("invalid App Check token: %v", err)
			http.Error(w, "invalid App Check token", http.StatusUnauthorized)
			return
		}

		// Proceed to the next handler
		next.ServeHTTP(w, r)
	})
}
