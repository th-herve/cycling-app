package app

import (
	"cycling-backend/internal/common"
	"cycling-backend/internal/domain/event"
	"cycling-backend/internal/domain/result"
	"cycling-backend/internal/domain/rider"

	"github.com/google/uuid"
	"github.com/rs/zerolog/log"
)

// Convert a list of Event to a list of EventReponse.
// And add the different data passed in the hydration context.
func createEventListResponse(events []*event.Event, hydrationCtx EventHydrationContext) []*EventResponse {
	flatResponse := convertToEventResponse(events)

	withCountry := hydrationCtx.Countries != nil
	if withCountry {
		hydrateCountry(flatResponse, hydrationCtx.Countries)
	}

	withResult := hydrationCtx.Results != nil
	if withResult {
		hydrateResults(flatResponse, hydrationCtx.Results, hydrationCtx.Riders)
	}

	response := restructureStages(flatResponse)

	return response
}

// Take a list of events where races and stages are flat.
// Add the race name to its stages, and add the stages to their race.
// Returns the new sturcture
func restructureStages(flatEvents []*EventResponse) []*EventResponse {
	result := make([]*EventResponse, 0, len(flatEvents))
	raceEventsById := make(map[uuid.UUID]*EventResponse)
	stagesEventsByRaceId := make(map[uuid.UUID][]*EventResponse)

	for _, e := range flatEvents {
		switch e.Type {
		case event.EventTypeRace:
			raceEventsById[e.ID] = e
			result = append(result, e)
		case event.EventTypeStage:
			if e.ParentEventID == nil {
				log.Warn().
					Str("eventId", e.ID.String()).
					Msg("Event of type stage does not have a parentId")
				continue
			}
			list, ok := stagesEventsByRaceId[*e.ParentEventID]
			if !ok {
				list = []*EventResponse{}
			}
			stagesEventsByRaceId[*e.ParentEventID] = append(list, e)
		}
	}

	// add the parent name to the stages
	for parentId, stagesList := range stagesEventsByRaceId {
		parent := raceEventsById[parentId]
		if parent == nil {
			continue
		}
		for _, s := range stagesList {
			s.ParentName = &parent.Name
		}
	}

	// add the stages to the response races
	for _, race := range result {
		stages, ok := stagesEventsByRaceId[race.ID]
		if ok {
			race.Stages = stages
		}
	}

	return result
}

func convertToEventResponse(events []*event.Event) []*EventResponse {
	response := make([]*EventResponse, 0, len(events))
	for _, event := range events {
		eventResp := EventResponse{
			Event: *event,
		}
		response = append(response, &eventResp)
	}

	return response
}

func hydrateCountry(events []*EventResponse, countryMap common.CountryMap) {
	for _, event := range events {

		if event.CountryCode != nil {
			c, ok := countryMap[*event.CountryCode]

			if !ok {
				log.Warn().Caller().
					Str("countryCode", *event.CountryCode).
					Str("eventId", event.ID.String()).
					Msg("Could not retrieve country code from the country map")
				continue
			}

			event.Country = common.CountryToSnapshot(*c)
		}
	}
}

// !!TODO For now it assumes it's only general ranking and does not group by result type
// TODO maybe return a new array instead of mutating
func hydrateResults(events []*EventResponse, results []result.Result, riders []rider.Rider) {
	resultsSnapshotByEvent := make(map[uuid.UUID][]ResultSnapshot)
	hydrateRider := len(riders) > 0

	var riderById map[uuid.UUID]RiderSnapshot
	if hydrateRider {
		riderById = toRiderSnapshotById(riders)
	}

	for _, r := range results {
		res := ResultToSnapshot(r)
		if hydrateRider && r.RiderID != nil {
			if rs, ok := riderById[*r.RiderID]; ok {
				res.Rider = rs
			}
		}
		resultsSnapshotByEvent[r.EventID] = append(resultsSnapshotByEvent[r.EventID], res)
	}

	// TODO handle other result type
	for _, e := range events {
		e.Results = &ResultsSnapshot{
			General: resultsSnapshotByEvent[e.ID],
		}
	}
}

// Take a list of events and returns a list of the country's id
func collectCountriesCodes(events []*event.Event) []string {
	seen := map[string]bool{}
	result := []string{}

	for _, event := range events {
		code := event.CountryCode
		if code == nil {
			continue
		}

		_, saw := seen[*code]
		if saw {
			continue
		}

		result = append(result, *code)
		seen[*code] = true
	}

	return result
}

func collectEventsId(events []*event.Event) []uuid.UUID {
	result := make([]uuid.UUID, len(events))

	for _, e := range events {
		result = append(result, e.ID)
	}

	return result
}

func groupResultByType(results []result.Result) ResultsByType {
	byType := ResultsByType{}

	for _, r := range results {
		t := r.Type
		arr, ok := byType[t]
		if !ok {
			arr = []result.Result{}
		}
		arr = append(arr, r)
		byType[t] = arr
	}

	return byType
}

// convert list of Rider to RiderSnapshot and map them by id
func toRiderSnapshotById(riders []rider.Rider) map[uuid.UUID]RiderSnapshot {
	byId := make(map[uuid.UUID]RiderSnapshot, len(riders))
	for _, r := range riders {
		byId[r.ID] = RiderToSnapshot(r)
	}
	return byId
}
