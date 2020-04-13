package main

import (
	"encoding/json"
	"log"
	"net/http"
)

func main() {
	port := "8080"

	http.Handle("/", http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
		enableCors(&w)

		w.Header().Set("Content-Type", "application/json")

		body, err := json.Marshal(map[string]interface{}{
			"data": "Hello, world",
		})

		if err != nil {
			w.WriteHeader(500)
			return
		}

		w.WriteHeader(200)
		w.Write(body)
	}))
	http.ListenAndServe(port, nil)
	log.Println("Now server is running on port http://localhost:" + port)
	http.ListenAndServe(":"+port, nil)
}

func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
}
