package api

import (
	"net/http"
)

func NewHttpHandler(handler http.HandlerFunc) http.HandlerFunc {
	var withAppCheck = AppCheckMiddleware(http.HandlerFunc(handler))
	var withCors = CorsMiddleware(withAppCheck.ServeHTTP)
	return withCors
}
