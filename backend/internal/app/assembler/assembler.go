package assembler

import (
	"github.com/google/uuid"
	"github.com/rs/zerolog/log"
	"github.com/th-herve/cycling-app/backend/internal/app/dto"
	"github.com/th-herve/cycling-app/backend/internal/app/hydrator"
	"github.com/th-herve/cycling-app/backend/internal/app/mapper"
	"github.com/th-herve/cycling-app/backend/pkg/domain"
)

func CreateEventListResponse(events []*domain.Event, hydrationCtx hydrator.EventHydrationContext) []*dto.EventDTO {
	flatResponse := mapper.EventsToDTO(events)

	withCountry := hydrationCtx.Countries != nil
	if withCountry {
		hydrator.HydrateEventCountry(flatResponse, hydrationCtx.Countries)
	}

	withResult := hydrationCtx.Results != nil
	if withResult {
		riderByID := mapper.RidersToSnapshotsByID(hydrationCtx.Riders)
		teamsByID := mapper.TeamsToSnapshotsByID(hydrationCtx.Teams)

		ridersTeams := mapper.MapValues(hydrationCtx.RidersTeams, mapper.TeamToSnapshot)

		hydrator.HydrateEventResults(flatResponse, hydrationCtx.Results, riderByID, teamsByID, ridersTeams, hydrationCtx.Countries)
	}

	if len(flatResponse) == 1 {
		return flatResponse
	}

	response := restructureStages(flatResponse)

	return response
}

func CreateResultsResponse(results []domain.Result, hydrationCtx hydrator.ResultHydrationContext) dto.ResultsResponse {
	dtos := mapper.ResultsToDTOs(results)

	response := mapper.ResultDtoToResponse(dtos)

	return response
}

// Take a list of events where races and stages are flat.
// Add the race name to its stages, and add the stages to their race.
// Returns the new sturcture.
func restructureStages(flatEvents []*dto.EventDTO) []*dto.EventDTO {
	result := make([]*dto.EventDTO, 0, len(flatEvents))
	raceEventsById := make(map[uuid.UUID]*dto.EventDTO)
	stagesEventsByRaceId := make(map[uuid.UUID][]*dto.EventDTO)

	for _, e := range flatEvents {
		switch e.Type {
		case domain.EventTypeRace:
			raceEventsById[e.ID] = e
			result = append(result, e)
		case domain.EventTypeStage:
			if e.ParentEventID == nil {
				log.Warn().
					Str("eventId", e.ID.String()).
					Msg("Event of type stage does not have a parentId")
				continue
			}
			list, ok := stagesEventsByRaceId[*e.ParentEventID]
			if !ok {
				list = []*dto.EventDTO{}
			}
			stagesEventsByRaceId[*e.ParentEventID] = append(list, e)
		}
	}

	// Add the parent name to the stages.
	for parentId, stagesList := range stagesEventsByRaceId {
		parent := raceEventsById[parentId]
		if parent == nil {
			continue
		}
		for _, s := range stagesList {
			s.ParentName = &parent.Name
		}
	}

	// Add the stages to the response races.
	for _, race := range result {
		stages, ok := stagesEventsByRaceId[race.ID]
		if ok {
			race.Stages = stages
		}
	}

	return result
}
