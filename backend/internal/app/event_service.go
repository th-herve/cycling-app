package app

import (
	"context"
	"cycling-backend/internal/common"
	"cycling-backend/pkg/domain"

	"github.com/rs/zerolog/log"
)

type EventService struct {
	storage        domain.EventStorage
	seasonService  *SeasonService
	resultService  *ResultService
	riderService   *RiderService
	countryStorage common.CountryStorage
}

type EventHydrationContext struct {
	Countries common.CountryMap
	Results   []domain.Result
	Riders    []domain.Rider
}

func NewEventService(
	storage domain.EventStorage,
	seasonService *SeasonService,
	resultService *ResultService,
	riderService *RiderService,
	countryStorage common.CountryStorage,
) *EventService {
	return &EventService{
		storage:        storage,
		seasonService:  seasonService,
		resultService:  resultService,
		riderService:   riderService,
		countryStorage: countryStorage,
	}
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
		log.Warn().Caller().Err(err).Msg("Error getting countries, they won't be added to the response")
	}

	eventsId := collectEventsId(events)
	results, err := s.resultService.FindManyByEventIds(ctx, eventsId,
		&domain.ResultSearchOptions{Limit: 3, Type: []domain.ResultType{domain.ResultTypeGeneral}})

	var riders []domain.Rider
	if err != nil {
		log.Warn().Err(err).Msg("Error getting results, they won't be added to the response")
	} else {
		ridersId := collectRidersId(results)
		riders, err = s.riderService.FindManyById(ctx, ridersId)
		if err != nil {
			log.Warn().Caller().Err(err).Msg("Error getting riders, they won't be added to the response")
		}
	}

	response := createEventListResponse(events, EventHydrationContext{Countries: countryMap, Results: results, Riders: riders})

	return response, nil
}
