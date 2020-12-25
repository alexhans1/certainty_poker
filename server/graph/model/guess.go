package model

import (
	"math"
	"strings"
	"github.com/umahmood/haversine"
	"github.com/alexhans1/certainty_poker/helpers"
)

// GetGeoDistance returns the distance between the geo guess and answer in km
func (g *Guess) GetGeoDistance(a *Answer) float64 {
	var radius float64 = 0
	if a.Geo.ToleranceRadius != nil {
		radius = *a.Geo.ToleranceRadius
	}
	guessCoord := haversine.Coord{Lat: g.Guess.Geo.Latitude, Lon: g.Guess.Geo.Longitude}
	answerCoord := haversine.Coord{Lat: a.Geo.Latitude, Lon: a.Geo.Longitude}
	_, km := haversine.Distance(guessCoord, answerCoord)
	diff := math.Max(
		0,
		km-radius,
	)
	g.Difference = &diff
	return diff
}

// GetOrderDeviation returns deviation score between guess and answer order
func (g *Guess) GetOrderDeviation(a *Answer) int {
	deviation := 0

	for index, item := range(strings.Split(a.Order, ";")) {
		deviation += helpers.IntAbs(helpers.SliceStringIndex(g.Guess.Order, item) - index)
	}

	return deviation
}