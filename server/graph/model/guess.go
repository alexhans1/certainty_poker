package model

import "github.com/umahmood/haversine"

// GetGeoDistance returns the distance between the geo guess and answer
func (g *Guess) GetGeoDistance(a *Answer) float64 {
	guessCoord := haversine.Coord{Lat: g.Guess.Geo.Latitude, Lon: g.Guess.Geo.Longitude}
	answerCoord := haversine.Coord{Lat: a.Geo.Latitude, Lon: a.Geo.Longitude}
	_, km := haversine.Distance(guessCoord, answerCoord)
	g.Difference = &km
	return km
}
