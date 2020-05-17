package model

import (
	"errors"
)

func (g *Game) PlayerIds() []string {
	playerIds := make([]string, 0)
	for _, player := range g.Players {
		playerIds = append(playerIds, player.ID)
	}

	return playerIds
}

func FindGame(games map[string]*Game, id string) (game *Game, err error) {
	if game, ok := games[id]; ok {
		return game, nil
	}
	return nil, errors.New("Game not found")
}
