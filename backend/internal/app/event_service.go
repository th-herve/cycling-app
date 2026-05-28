package app

import (
	"context"

	"github.com/google/uuid"
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
	teamService    *TeamService
}

type EventHydrationContext struct {
	Countries storage.CountryMap
	Results   []domain.Result
	Riders    []*domain.Rider
	Teams     []*domain.TeamSeason
}

func NewEventService(
	storage *storage.EventStorage,
	seasonService *SeasonService,
	resultService *ResultService,
	riderService *RiderService,
	countryStorage *storage.CountryStorage,
	teamService *TeamService,
) *EventService {
	return &EventService{
		storage:        storage,
		seasonService:  seasonService,
		resultService:  resultService,
		riderService:   riderService,
		countryStorage: countryStorage,
		teamService:    teamService,
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

	// Collect events ids to find their results.
	eventsId := collectEventsID(events)
	results, err := s.resultService.FindManyByEventIDs(ctx, eventsId,
		&storage.ResultSearchOptions{Limit: 3})

	// Collect the riders ids in the results, and find them.
	var riders []*domain.Rider
	var teams []*domain.TeamSeason
	if err != nil {
		log.Warn().Err(err).Msg("Error getting results, they won't be added to the response")
	} else {
		ridersID := collectRidersId(results)
		riders, err = s.riderService.FindManyById(ctx, ridersID)
		if err != nil {
			log.Warn().Caller().Err(err).Msg("Error getting riders, they won't be added to the response")
		}

		teamsID := collectTeamsId(results)
		teams, err = s.teamService.FindManyById(ctx, teamsID)
		if err != nil {
			log.Warn().Caller().Err(err).Msg("Error getting teams, they won't be added to the response")
		}
	}

	// Collect the countries code in the events and riders. And find them.
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

	response := createEventListResponse(events, EventHydrationContext{Countries: countryMap, Results: results, Riders: riders, Teams: teams})

	return response, nil
}

func (s *EventService) FindByID(ctx context.Context, id uuid.UUID) (*EventResponse, error) {
	event, err := s.storage.FindByID(ctx, id)

	if err != nil {
		log.Debug().
			Caller().
			Msg("Error getting team")
		return nil, common.GetErr("EventService FindById", err)
	}

	countryMap, err := s.countryStorage.FindManyByAlpha3Code(ctx, []string{*event.CountryCode})

	if err != nil {
		log.Warn().Caller().Err(err).Msg("Error getting countries, they won't be added to the response")
	}


	response := createEventListResponse([]*domain.Event{&event}, EventHydrationContext{Countries: countryMap})

	return response[0], nil
}
