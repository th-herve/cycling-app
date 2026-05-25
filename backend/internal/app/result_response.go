package app

import (
	"github.com/google/uuid"
	"github.com/th-herve/cycling-app/backend/pkg/domain"
)

func collectRidersId(results []domain.Result) []uuid.UUID {
	seen := map[uuid.UUID]bool{}
	ridersID := []uuid.UUID{}

	for _, r := range results {
		riderId := r.RiderID
		if riderId == nil {
			continue
		}

		_, saw := seen[*riderId]
		if saw {
			continue
		}

		ridersID = append(ridersID, *riderId)
		seen[*riderId] = true
	}

	return ridersID
}

func collectTeamsId(results []domain.Result) []uuid.UUID {
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
