package main

import (
	"cycling-backend/internal/app"
	"cycling-backend/internal/app/handler"
	"cycling-backend/internal/common"
	"cycling-backend/internal/domain/event"
	"cycling-backend/internal/domain/season"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"github.com/rs/zerolog/log"
)

// prod or dev
var AppMode string

const defaultMode = "dev"

func init() {
	err := godotenv.Load()

	AppMode = os.Getenv("ENV")
	if AppMode == "" {
		AppMode = defaultMode
	}

	common.SetUpLogger(AppMode)

	if err != nil {
		log.Warn().Msg("Warning: no .env file")
	}
}

func main() {

	db, err := sqlx.Connect("postgres", "user=admin password=admin host=localhost port=5432 dbname=cycling sslmode=disable")
	if err != nil {
		log.Fatal().Str("err", err.Error()).Msg("Failed to connect to database")
	}
	defer db.Close()

	if err := db.Ping(); err != nil {
		log.Fatal().Str("err", err.Error()).Msg("Failed to ping to database")
	}

	log.Info().Msg("Database connection established")

	seasonStorage := season.NewSeasonStorage(db)
	seasonService := app.NewSeasonService(seasonStorage)

	countryStorage := common.NewCountryStorageStorage(db)

	eventStorage := event.NewEventStorage(db)
	eventService := app.NewEventService(eventStorage, seasonService, countryStorage)
	eventHandler := handler.NewEventHandler(eventService)

	if AppMode == "prod" {
		gin.SetMode(gin.ReleaseMode)
	}

	r := gin.New()
	r.Use(gin.Recovery())
	r.Use(handler.LoggerMiddleware())
	r.Use(handler.ErrorMiddleware())

	r.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})

	eventGroup := r.Group("/events")
	{
		eventGroup.GET("", eventHandler.Get)
	}

	// Start server on port 8080 (default)
	// Server will listen on 0.0.0.0:8080 (localhost:8080 on Windows)
	r.Run()
}
