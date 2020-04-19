package main

import (
	"log"
	"net/http"
	"os"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/alexhans1/certainty_poker/graph"
	"github.com/rs/cors"

	"github.com/alexhans1/certainty_poker/graph/generated"
)

const defaultPort = "8080"

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	server := handler.NewDefaultServer(generated.NewExecutableSchema(graph.NewResolver()))

	mux := http.NewServeMux()

	mux.HandleFunc("/", playground.Handler("GraphQL playground", "/query"))
	mux.Handle("/query", server)

	handler := cors.Default().Handler(mux)

	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, handler))
}
