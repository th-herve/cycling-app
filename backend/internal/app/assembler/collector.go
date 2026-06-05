package assembler

import (
	"github.com/google/uuid"
	"github.com/th-herve/cycling-app/backend/pkg/domain"
)

func CollectResultsRidersID(results []domain.Result) []uuid.UUID {
	seen := map[uuid.UUID]bool{}
	ridersID := []uuid.UUID{}

	for _, r := range results {
		riderID := r.RiderID
		if riderID == nil {
			continue
		}

		_, saw := seen[*riderID]
		if saw {
			continue
		}

		ridersID = append(ridersID, *riderID)
		seen[*riderID] = true
	}

	return ridersID
}

func CollectResultTeamsID(results []domain.Result) []uuid.UUID {
	seen := map[uuid.UUID]bool{}
	teamsID := []uuid.UUID{}

	for _, r := range results {
		teamID := r.TeamSeasonID
		if teamID == nil {
			continue
		}

		_, saw := seen[*teamID]
		if saw {
			continue
		}

		teamsID = append(teamsID, *teamID)
		seen[*teamID] = true
	}

	return teamsID
}

func CollectEventsID(events []*domain.Event) []uuid.UUID {
	result := make([]uuid.UUID, len(events))

	for _, e := range events {
		result = append(result, e.ID)
	}

	return result
}

// Take a list of entity implementing HasCountryCode and returns a list of the country's id
func CollectCountriesCodes(entities ...[]domain.HasCountryCode) []string {
	seen := map[string]bool{}
	result := []string{}

	for _, e1 := range entities {
		for _, e2 := range e1 {
			code := e2.GetCountryCode()
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
	}

	return result
}
