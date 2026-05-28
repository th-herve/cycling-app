package app

import (
	"github.com/google/uuid"
	"github.com/th-herve/cycling-app/backend/pkg/domain"
)

type ResultsResponse struct {
	General  []ResultResponse `json:"general,omitempty"`
	Mountain []ResultResponse `json:"mountain,omitempty"`
	Point    []ResultResponse `json:"point,omitempty"`
	Young    []ResultResponse `json:"young,omitempty"`

	Stage           []ResultResponse `json:"stage,omitempty"`
	OverallGeneral  []ResultResponse `json:"overallGeneral,omitempty"`
	OverallPoint    []ResultResponse `json:"overallPoint,omitempty"`
	OverallMountain []ResultResponse `json:"overallMountain,omitempty"`
	OverallYoung    []ResultResponse `json:"overallYoung,omitempty"`
}

type ResultResponse struct {
	Rank        *int16               `json:"rank,omitzero"` // Omitzero because 0 means a special status apply (DNF,DNS...).
	Rider       *RiderSnapshot       `json:"rider,omitempty"`
	Team        *TeamSnapshot        `json:"team,omitempty"`
	Status      *domain.ResultStatus `json:"status,omitempty"`
	Points      *int16               `json:"points,omitempty"`
	TimeSeconds *int32               `json:"time_seconds,omitempty"`
	GapSeconds  *int32               `json:"gap_seconds,omitempty"`
}

// Converts a result to a result snapshot (Response with only the rank added).
// Let the caller hydrate the rider/team.
func ResultToSnapshot(result domain.Result) ResultResponse {
	return ResultResponse{
		Rank: result.Rank,
	}
}

// Converts a result to a result response.
// Let the caller hydrate the rider/team.
func ResultToResponse(result domain.Result) ResultResponse {
	return ResultResponse{
		Rank:        result.Rank,
		Status:      result.Status,
		Points:      result.Points,
		TimeSeconds: result.TimeSeconds,
	}
}

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
