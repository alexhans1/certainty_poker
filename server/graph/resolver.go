package graph

//go:generate go run github.com/99designs/gqlgen

import (
	"sync"

	"github.com/alexhans1/certainty_poker/graph/generated"
	"github.com/alexhans1/certainty_poker/graph/model"
)

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

type Resolver struct {
	games        map[string]*model.Game
	gameChannels map[string]chan *model.Game
	mutex        sync.Mutex
}

func NewResolver() generated.Config {
	return generated.Config{
		Resolvers: &Resolver{
			games:        map[string]*model.Game{},
			gameChannels: map[string]chan *model.Game{},
			mutex:        sync.Mutex{},
		},
	}
}
