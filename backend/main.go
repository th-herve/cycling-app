package main

import (
	"embed"
	"fmt"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"github.com/pressly/goose/v3"
	"github.com/rs/zerolog/log"
	"github.com/th-herve/cycling-app/backend/internal/app"
	"github.com/th-herve/cycling-app/backend/internal/app/handler"
	"github.com/th-herve/cycling-app/backend/internal/app/storage"
	"github.com/th-herve/cycling-app/backend/internal/common"
)

// prod or dev
var AppMode string

const defaultMode = "dev"

var DbConfig struct {
	user     string
	password string
	name     string
	host     string
}

// next comment is read by go to embed the migration files
//
//go:embed migrations/*.sql
var embedMigrations embed.FS
var migrationsDir = "migrations"

func init() {
	err := godotenv.Load()

	AppMode = os.Getenv("ENV")
	if AppMode == "" {
		AppMode = defaultMode
	}

	common.SetUpLogger(AppMode)

	DbConfig.name = os.Getenv("DB_NAME")
	DbConfig.user = os.Getenv("DB_USER")
	DbConfig.password = os.Getenv("DB_PASSWORD")
	DbConfig.host = os.Getenv("DB_HOST")

	if DbConfig.host == "" {
		DbConfig.host = "localhost"
	}

	if err != nil {
		log.Warn().Msg("Warning: no .env file")
	}
}

func applyMigrations(db *sqlx.DB) {
	goose.SetBaseFS(embedMigrations)
	if err := goose.SetDialect("postgres"); err != nil {
		log.Fatal().Err(err).Msg("Failed to set goose dialect")
	}

	if err := goose.Up(db.DB, migrationsDir); err != nil {
		log.Fatal().Err(err).Msg("Failed to run migrations")
	}

	log.Debug().Msg("Applied migrations")
	if AppMode == "dev" {
		goose.Status(db.DB, migrationsDir)
	}
}

func main() {

	dbDataSource := fmt.Sprintf("user=%s password=%s host=%s port=5432 dbname=%s sslmode=disable",
		DbConfig.user, DbConfig.password, DbConfig.host, DbConfig.name)

	db, err := sqlx.Connect("postgres", dbDataSource)
	if err != nil {
		log.Fatal().Str("err", err.Error()).
			Str("dbUser", DbConfig.user).
			Str("dbName", DbConfig.name).
			Str("host", DbConfig.host).
			Msg("Failed to connect to database")
	}
	defer db.Close()

	if err := db.Ping(); err != nil {
		log.Fatal().Str("err", err.Error()).Msg("Failed to ping to database")
	}

	log.Info().Msg("Database connection established")

	applyMigrations(db)

	seasonStorage := storage.NewSeasonStorage(db)
	seasonService := app.NewSeasonService(seasonStorage)

	countryStorage := common.NewCountryStorageStorage(db)

	resultStorage := storage.NewResultStorage(db)
	resultService := app.NewResultService(resultStorage, countryStorage)

	riderStorage := storage.NewRiderStorage(db)
	riderService := app.NewRiderService(riderStorage, countryStorage)

	eventStorage := storage.NewEventStorage(db)
	eventService := app.NewEventService(eventStorage, seasonService, resultService, riderService, countryStorage)
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
