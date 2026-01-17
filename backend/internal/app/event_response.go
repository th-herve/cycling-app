package app

import (
	"cycling-backend/internal/common"
	"cycling-backend/internal/domain/event"

	"github.com/google/uuid"
	"github.com/rs/zerolog/log"
)

/*
* Convert a list of Event to a list of EventReponse.
* And add the different data passed in the hydration context.
 */
func createEventListResponse(events []*event.Event, hydrationCtx EventHydrationContext) []*EventResponse {
	flatResponse := convertToEventResponse(events)

	withCountry := hydrationCtx.Countries != nil
	if withCountry {
		hydrateCountry(flatResponse, hydrationCtx.Countries)
	}

	response := restructureStages(flatResponse)

	return response
}

/*
* Take a list of events where races and stages are flat.
* Add the race name to its stages, and add the stages to their race.
* Returns the new sturcture
 */
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

/*
* Take a list of events and returns a list of the country's id
 */
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
