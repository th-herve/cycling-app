package app

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"github.com/rs/zerolog/log"
	"github.com/th-herve/cycling-app/backend/internal/app/assembler"
	"github.com/th-herve/cycling-app/backend/internal/app/dto"
	"github.com/th-herve/cycling-app/backend/internal/app/hydrator"
	"github.com/th-herve/cycling-app/backend/internal/app/mapper"
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

func (s *EventService) FindAllBySeason(ctx context.Context, year int, gender domain.Gender) ([]*dto.EventDTO, error) {
	events, err := s.storage.FindAllBySeason(ctx, year, gender)

	if err != nil {
		log.Debug().
			Int("year", year).
			Str("gender", string(gender)).
			Caller().
			Msg("Error getting events")
		return nil, common.GetErr("EventService FindAllBySeason", err)
	}

	hydrationCtx := s.getHydrationContext(ctx, events, 3, year)

	response := assembler.CreateEventListResponse(events, hydrationCtx)

	return response, nil
}

func (s *EventService) FindByID(ctx context.Context, id uuid.UUID) (*dto.EventDTO, error) {
	event, err := s.storage.FindByID(ctx, id)

	if err != nil {
		log.Debug().
			Caller().
			Msg("Error getting team")
		return nil, common.GetErr("EventService FindByID", err)
	}

	asList := []*domain.Event{&event}

	hydrationCtx := s.getHydrationContext(ctx, asList, 0, event.SeasonYear)

	response := assembler.CreateEventListResponse(asList, hydrationCtx)

	if len(response) == 0 {
		return nil, common.GetErr("EventService FindByID", errors.New("response not found"))
	}

	return response[0], nil
}

func (s *EventService) getHydrationContext(ctx context.Context, events []*domain.Event, resultLimit int, seasonYear int) hydrator.EventHydrationContext {

	// Collect events ids to find their results.
	eventsID := assembler.CollectEventsID(events)
	results, err := s.resultService.FindManyByEventIDs(ctx, eventsID,
		&storage.ResultSearchOptions{Limit: resultLimit})

	// Collect the riders and teams ids in the results, and find them.
	var riders []*domain.Rider
	var teams []*domain.TeamSeason
	var ridersTeams map[uuid.UUID]*domain.TeamSeason
	if err != nil {
		log.Warn().Err(err).Msg("Error getting results, they won't be added to the response")
	} else {
		ridersID := assembler.CollectResultsRidersID(results)
		riders, err = s.riderService.FindManyByID(ctx, ridersID)
		if err != nil {
			log.Warn().Caller().Err(err).Msg("Error getting riders, they won't be added to the response")
		}

		// Get the teams from the result (for TTT or teams result).
		teamsID := assembler.CollectResultTeamsID(results)
		teams, err = s.teamService.FindManyByID(ctx, teamsID)
		if err != nil {
			log.Warn().Caller().Err(err).Msg("Error getting teams, they won't be added to the response")
		}

		// Get the teams for each rider.
		ridersTeams, err = s.teamService.FindManyByRiderIDAndSeason(ctx, ridersID, seasonYear)
		if err != nil {
			log.Warn().Caller().Err(err).Msg("Error getting teams for riders, they won't be added to the response")
		}
	}

	// Collect the countries code in the events and riders. And find them.
	countryCodes := assembler.CollectCountriesCodes(
		mapper.ToHasCountryCodeSlice(events),
		mapper.ToHasCountryCodeSlice(riders),
	)
	countryMap, err := s.countryStorage.FindManyByAlpha3Code(ctx, countryCodes)

	if err != nil {
		log.Warn().Caller().Err(err).Msg("Error getting countries, they won't be added to the response")
	}

	return hydrator.EventHydrationContext{
		Countries:   countryMap,
		Results:     results,
		Riders:      riders,
		Teams:       teams,
		RidersTeams: ridersTeams,
	}
}
