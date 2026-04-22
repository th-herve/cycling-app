package app

import (
	"context"

	"github.com/rs/zerolog/log"
	"github.com/th-herve/cycling-app/backend/internal/app/storage"
	"github.com/th-herve/cycling-app/backend/internal/common"
	"github.com/th-herve/cycling-app/backend/pkg/domain"
)

type EventService struct {
	storage        *storage.EventStorage
	seasonService  *SeasonService
	resultService  *ResultService
	riderService   *RiderService
	countryStorage *storage.CountryStorage
}

type EventHydrationContext struct {
	Countries storage.CountryMap
	Results   []domain.Result
	Riders    []*domain.Rider
}

func NewEventService(
	storage *storage.EventStorage,
	seasonService *SeasonService,
	resultService *ResultService,
	riderService *RiderService,
	countryStorage *storage.CountryStorage,
) *EventService {
	return &EventService{
		storage:        storage,
		seasonService:  seasonService,
		resultService:  resultService,
		riderService:   riderService,
		countryStorage: countryStorage,
	}
}

func (s *EventService) FindAllBySeason(ctx context.Context, year int, gender domain.Gender) ([]*EventResponse, error) {
	events, err := s.storage.FindAllBySeason(ctx, year, gender)

	if err != nil {
		log.Debug().
			Int("year", year).
			Str("gender", string(gender)).
			Caller().
			Msg("Error getting events")
		return nil, common.GetErr("EventService FindAllBySeason", err)
	}

	eventsId := collectEventsId(events)
	results, err := s.resultService.FindManyByEventIds(ctx, eventsId,
		&storage.ResultSearchOptions{Limit: 3, Type: []domain.ResultType{domain.ResultTypeGeneral}})

	var riders []*domain.Rider
	if err != nil {
		log.Warn().Err(err).Msg("Error getting results, they won't be added to the response")
	} else {
		ridersId := collectRidersId(results)
		riders, err = s.riderService.FindManyById(ctx, ridersId)
		if err != nil {
			log.Warn().Caller().Err(err).Msg("Error getting riders, they won't be added to the response")
		}
	}

	var combined []domain.HasCountryCode
	for _, e := range events {
		combined = append(combined, e)
	}
	for _, r := range riders {
		combined = append(combined, r)
	}
	countryCodes := collectCountriesCodes(combined)
	countryMap, err := s.countryStorage.FindManyByAlpha3Code(ctx, countryCodes)

	if err != nil {
		log.Warn().Caller().Err(err).Msg("Error getting countries, they won't be added to the response")
	}

	response := createEventListResponse(events, EventHydrationContext{Countries: countryMap, Results: results, Riders: riders})

	return response, nil
}
