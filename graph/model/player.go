package model

import(
	"errors"
)


func ShufflePlayers(playerSlice []*Player) {
	for i := range playerSlice {
		j := rand.Intn(i + 1)
		playerSlice[i], playerSlice[j] = playerSlice[j], playerSlice[i]
	}
}

func FindPlayer(slice []*Player, id string) (player *Player, err error) {
	for i := range slice {
		if slice[i].Id == id {
			return slice[i], nil
		}
	}
	return nil, errors.New("Player not found")
}
