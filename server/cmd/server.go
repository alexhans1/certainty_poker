package main

import (
	"log"
	"net/http"
	"os"
	"time"

	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/99designs/gqlgen/graphql/handler/lru"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/gorilla/websocket"

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

	server := handler.New(generated.NewExecutableSchema(graph.NewResolver()))

	server.AddTransport(transport.Websocket{
		KeepAlivePingInterval: 10 * time.Second,
		Upgrader: websocket.Upgrader{
			CheckOrigin: func(r *http.Request) bool {
				return true
			},
		},
	})
	server.AddTransport(transport.POST{})
	server.AddTransport(transport.Options{})
	server.SetQueryCache(lru.New(1000))
	server.Use(extension.Introspection{})
	server.Use(extension.AutomaticPersistedQuery{
		Cache: lru.New(100),
	})

	mux := http.NewServeMux()
	c := cors.Default().Handler(mux)

	mux.HandleFunc("/", playground.Handler("GraphQL playground", "/query"))
	mux.Handle("/query", server)

	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, c))
}
