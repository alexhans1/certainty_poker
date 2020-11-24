package model

import "math"

// GetGeoDistance returns the distance between the geo guess and answer
func (g *Guess) GetGeoDistance(a *Answer) float64 {
	return math.Pow(g.Guess.Geo.Latitude-a.Geo.Latitude, 2) + math.Pow(g.Guess.Geo.Longitude-a.Geo.Longitude, 2)
}
