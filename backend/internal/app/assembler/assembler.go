package assembler

import (
	"github.com/google/uuid"
	"github.com/rs/zerolog/log"
	"github.com/th-herve/cycling-app/backend/internal/app/dto"
	"github.com/th-herve/cycling-app/backend/internal/app/hydrator"
	"github.com/th-herve/cycling-app/backend/internal/app/mapper"
	"github.com/th-herve/cycling-app/backend/pkg/domain"
)

func CreateEventListResponse(events []*domain.Event, hydrationCtx hydrator.EventHydrationContext, restructure bool) []*dto.EventDTO {
	flatResponse := mapper.EventsToDTO(events)

	withCountry := hydrationCtx.Countries != nil
	if withCountry {
		hydrator.HydrateEventCountry(flatResponse, hydrationCtx.Countries)
	}

	withResult := hydrationCtx.Results != nil
	if withResult {
		riderByID := mapper.RidersToSnapshotsByID(hydrationCtx.Riders)
		teamsByID := mapper.TeamsToSnapshotsByID(hydrationCtx.Teams)

		hydrator.HydrateEventResults(flatResponse, hydrationCtx.Results, riderByID, teamsByID, hydrationCtx.Countries)
	}

	if len(flatResponse) == 1 || !restructure {
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
	raceEventsByID := make(map[uuid.UUID]*dto.EventDTO)
	stagesEventsByRaceID := make(map[uuid.UUID][]*dto.EventDTO)

	for _, e := range flatEvents {
		switch e.Type {
		case domain.EventTypeRace:
			raceEventsByID[e.ID] = e
			result = append(result, e)
		case domain.EventTypeStage:
			if e.ParentEventID == nil {
				log.Warn().
					Str("eventID", e.ID.String()).
					Msg("Event of type stage does not have a parentID")
				continue
			}
			list, ok := stagesEventsByRaceID[*e.ParentEventID]
			if !ok {
				list = []*dto.EventDTO{}
			}
			stagesEventsByRaceID[*e.ParentEventID] = append(list, e)
		}
	}

	// Add the parent name to the stages.
	for parentID, stagesList := range stagesEventsByRaceID {
		parent := raceEventsByID[parentID]
		if parent == nil {
			continue
		}
		for _, s := range stagesList {
			s.ParentName = &parent.Name
		}
	}

	// Add the stages to the response races.
	for _, race := range result {
		stages, ok := stagesEventsByRaceID[race.ID]
		if ok {
			race.Stages = stages
		}
	}

	return result
}
