package graph

//go:generate go run github.com/99designs/gqlgen

import (
	"github.com/alexhans1/certainty_poker/graph/generated"
	"github.com/alexhans1/certainty_poker/graph/model"
)

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

type Resolver struct {
	games map[string]*model.Game
}

func NewResolver() generated.Config {
	r := Resolver{}
	r.games = map[string]*model.Game{}

	return generated.Config{
		Resolvers: &r,
	}
}
