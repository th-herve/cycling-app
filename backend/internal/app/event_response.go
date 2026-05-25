package app

import (
	"github.com/google/uuid"
	"github.com/rs/zerolog/log"
	"github.com/th-herve/cycling-app/backend/internal/app/storage"
	"github.com/th-herve/cycling-app/backend/pkg/domain"
)

// Convert a list of Event to a list of EventReponse.
// And add the different data passed in the hydration context.
func createEventListResponse(events []*domain.Event, hydrationCtx EventHydrationContext) []*EventResponse {
	flatResponse := convertToEventResponse(events)

	withCountry := hydrationCtx.Countries != nil
	if withCountry {
		hydrateCountry(flatResponse, hydrationCtx.Countries)
	}

	withResult := hydrationCtx.Results != nil
	if withResult {
		riderByID := toRiderSnapshotByID(hydrationCtx.Riders, hydrationCtx.Countries)
		teamsByID := toTeamSnapshotByID(hydrationCtx.Teams, hydrationCtx.Countries)

		hydrateResults(flatResponse, hydrationCtx.Results, riderByID, teamsByID)
	}

	if len(flatResponse) == 1 {
		return flatResponse
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

func convertToEventResponse(events []*domain.Event) []*EventResponse {
	response := make([]*EventResponse, 0, len(events))
	for _, event := range events {
		eventResp := EventResponse{
			Event: *event,
		}
		response = append(response, &eventResp)
	}

	return response
}

func hydrateCountry(events []*EventResponse, countryMap storage.CountryMap) {
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

			event.Country = domain.CountryToSnapshot(*c)
		}
	}
}

func hydrateResults(events []*EventResponse, results []domain.Result, riderByID map[uuid.UUID]RiderSnapshot, teamByID map[uuid.UUID]TeamSnapshot) {
	resultsSnapshotByEvent := make(map[uuid.UUID]map[domain.ResultType][]ResultSnapshot)
	hydrateRider := len(riderByID) > 0
	hydrateTeam := len(teamByID) > 0 // Teams are for ttt stage result.

	for _, r := range results {
		res := ResultToSnapshot(r)
		if hydrateRider && r.RiderID != nil {
			if rs, ok := riderByID[*r.RiderID]; ok {
				res.Rider = rs
			}
		}
		if r.RiderID == nil && hydrateTeam && r.TeamSeasonID != nil {
			if t, ok := teamByID[*r.TeamSeasonID]; ok {
				res.Team = t
			}
		}

		if _, ok := resultsSnapshotByEvent[r.EventID]; !ok {
			resultsSnapshotByEvent[r.EventID] = make(map[domain.ResultType][]ResultSnapshot)
		}
		resultsSnapshotByEvent[r.EventID][r.Type] = append(resultsSnapshotByEvent[r.EventID][r.Type], res)
	}

	for _, e := range events {
		e.Results = &ResultsSnapshot{
			General:  resultsSnapshotByEvent[e.ID][domain.ResultTypeGeneral],
			Mountain: resultsSnapshotByEvent[e.ID][domain.ResultTypeMountain],
			Point:    resultsSnapshotByEvent[e.ID][domain.ResultTypePoint],
			Young:    resultsSnapshotByEvent[e.ID][domain.ResultTypeYoung],

			Stage:           resultsSnapshotByEvent[e.ID][domain.ResultTypeStageGeneral],
			OverallGeneral:  resultsSnapshotByEvent[e.ID][domain.ResultTypeOverallGeneral],
			OverallPoint:    resultsSnapshotByEvent[e.ID][domain.ResultTypeOverallPoint],
			OverallMountain: resultsSnapshotByEvent[e.ID][domain.ResultTypeOverallMountain],
			OverallYoung:    resultsSnapshotByEvent[e.ID][domain.ResultTypeOverallYoung],
		}
	}
}

func collectEventsID(events []*domain.Event) []uuid.UUID {
	result := make([]uuid.UUID, len(events))

	for _, e := range events {
		result = append(result, e.ID)
	}

	return result
}

// convert list of Rider to RiderSnapshot and map them by id
func toRiderSnapshotByID(riders []*domain.Rider, countryMap storage.CountryMap) map[uuid.UUID]RiderSnapshot {
	byId := make(map[uuid.UUID]RiderSnapshot, len(riders))
	for _, r := range riders {
		snap := RiderToSnapshot(r)
		if snap.Nationality != nil {
			a3 := snap.Nationality.Alpha3
			c, ok := countryMap[a3]
			if ok {
				snap.Nationality = domain.CountryToSnapshot(*c)
			}

		}

		byId[r.ID] = snap
	}
	return byId
}

// convert list of Team to TeamSnapshot and map them by id
func toTeamSnapshotByID(teams []*domain.TeamSeason, countryMap storage.CountryMap) map[uuid.UUID]TeamSnapshot {
	byId := make(map[uuid.UUID]TeamSnapshot, len(teams))
	for _, t := range teams {
		snap := TeamToSnapshot(t)
		if snap.Country != nil {
			a3 := snap.Country.Alpha3
			c, ok := countryMap[a3]
			if ok {
				snap.Country = domain.CountryToSnapshot(*c)
			}

		}

		byId[t.ID] = snap
	}
	return byId
}
