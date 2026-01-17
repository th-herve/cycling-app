package handler

import (
	"fmt"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/rs/zerolog/log"
)

func ErrorMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Next()

		if len(c.Errors) > 0 {
			err := c.Errors.Last()
			HandleError(c, err)
		}
	}
}

func LoggerMiddleware() gin.HandlerFunc {

	return func(c *gin.Context) {

		startTime := time.Now()
		requestID := uuid.New().String()

		c.Set("request_id", requestID)

		c.Next()

		duration := time.Since(startTime)
		clientIP := c.ClientIP()
		method := c.Request.Method
		// path := c.Request.URL.Path
		path := c.Request.URL.RequestURI()
		statusCode := c.Writer.Status()

		// attach the info to a sub logger
		sublog := log.With().
			Str("requestID", requestID).
			Dur("duration", duration).
			Str("clientIP", clientIP).
			Str("method", method).
			Str("path", path).
			Int("status", statusCode).
			Logger()

		// set the logger to info or error, and send it. Attaching the error if needed
		if len(c.Errors) > 0 {
			err := c.Errors.Last()
			sublog.Error().Err(err).Msg(fmt.Sprintf("[%s] %d", method, statusCode))
		} else {
			sublog.Info().Msg(fmt.Sprintf("[%s] %d", method, statusCode))
		}
	}
}
