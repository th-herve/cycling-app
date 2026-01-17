package common

import (
	"os"

	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
	"github.com/rs/zerolog/pkgerrors"
)

func SetUpLogger(env string) {
	if env == "prod" {
		zerolog.SetGlobalLevel(zerolog.InfoLevel)
	} else {
		// set the global logger
		zerolog.SetGlobalLevel(zerolog.DebugLevel)
		log.Logger = log.Output(zerolog.ConsoleWriter{Out: os.Stderr})
	}

	zerolog.ErrorStackMarshaler = pkgerrors.MarshalStack

	log.Info().Msg("Logger set up")

}
