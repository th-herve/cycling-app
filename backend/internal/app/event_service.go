package app

import (
	"context"
	"cycling-backend/internal/common"
	"cycling-backend/internal/domain/event"

	"github.com/rs/zerolog/log"
)

type EventService struct {
	storage        event.Storage
	countryStorage common.CountryStorage
	seasonService  *SeasonService
}

type EventHydrationContext struct {
	Countries common.CountryMap
}

func NewEventService(storage event.Storage, seasonService *SeasonService, countryStorage common.CountryStorage) *EventService {
	return &EventService{storage: storage, seasonService: seasonService, countryStorage: countryStorage}
}

func (s *EventService) FindAllBySeason(ctx context.Context, year int, gender common.Gender) ([]*EventResponse, error) {
	season, err := s.seasonService.FindOne(ctx, year, gender)

	if err != nil {
		log.Debug().
			Int("year", year).
			Str("gender", string(gender)).
			Err(err).
			Caller().
			Msg("Error getting season")
		return nil, common.GetErr("EventService FindAllBySeason", err)
	}

	events, err := s.storage.FindAllBySeason(ctx, season.ID)

	if err != nil {
		log.Debug().
			Int("year", year).
			Str("gender", string(gender)).
			Str("seasonId", season.ID.String()).
			Caller().
			Msg("Error getting events")
		return nil, common.GetErr("EventService FindAllBySeason", err)
	}

	countryCodes := collectCountriesCodes(events)
	countryMap, err := s.countryStorage.FindManyByAlpha3Code(ctx, countryCodes)

	if err != nil {
		// only log the error, the countries won't be added to the response
		log.Warn().Caller().Err(err).Msg("Error getting countries, they won't be added to the response")
	}

	response := createEventListResponse(events, EventHydrationContext{Countries: countryMap})

	return response, nil
}
