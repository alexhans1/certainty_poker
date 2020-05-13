package model

import(
	"errors"
)


func FindGame(games map[string]*Game, id string) (game *Game, err error) {
	if game, ok := games[id]; ok {
		return game, nil
	}
	return nil, errors.New("Game not found")
}
