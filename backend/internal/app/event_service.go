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

	hydrationCtx := s.getHydrationContext(ctx, events, year, &storage.ResultSearchOptions{Limit: 3})

	response := assembler.CreateEventListResponse(events, hydrationCtx, true)

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

	hydrationCtx := s.getHydrationContext(ctx, asList, event.SeasonYear, nil)

	response := assembler.CreateEventListResponse(asList, hydrationCtx, true)

	if len(response) == 0 {
		return nil, common.GetErr("EventService FindByID", errors.New("response not found"))
	}

	return response[0], nil
}

func (s *EventService) FindStages(ctx context.Context, parentEventID uuid.UUID) ([]*dto.EventDTO, error) {
	events, err := s.storage.FindStages(ctx, parentEventID)

	if err != nil {
		log.Debug().
			Str("parentEventID", parentEventID.String()).
			Caller().
			Msg("Error getting events")
		return nil, common.GetErr("EventService FindStages", err)
	}

	if len(events) == 0 {
		return nil, common.GetErr("EventService FindStages", errors.New("response not found"))
	}

	hydrationCtx := s.getHydrationContext(ctx, events, events[0].SeasonYear, &storage.ResultSearchOptions{Limit: 1, Type: []domain.ResultType{domain.ResultTypeStageGeneral}})

	response := assembler.CreateEventListResponse(events, hydrationCtx, false)

	return response, nil
}

// TODO refactor
func (s *EventService) getHydrationContext(ctx context.Context, events []*domain.Event, seasonYear int, resultOpt *storage.ResultSearchOptions) hydrator.EventHydrationContext {

	// Collect events ids to find their results.
	eventsID := assembler.CollectEventsID(events)
	results, err := s.resultService.FindManyByEventIDs(ctx, eventsID,
		resultOpt)

	// Collect the riders and teams ids in the results, and find them.
	var riders []*domain.Rider
	var teams []*domain.TeamSeason
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
	}

	// Collect the countries code in the events and riders. And find them.
	countryCodes := assembler.CollectCountriesCodes(
		mapper.ToHasCountryCodeSlice(events),
		mapper.ToHasCountryCodeSlice(riders),
		mapper.ToHasCountryCodeSlice(teams),
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
	}
}
