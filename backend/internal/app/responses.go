package app

import (
	"github.com/google/uuid"
	"github.com/th-herve/cycling-app/backend/pkg/domain"
)

type EventResponse struct {
	domain.Event
	Country    *domain.CountrySnapshot `json:"country,omitempty"`
	Stages     []*EventResponse        `json:"stages,omitempty"`
	ParentName *string                 `json:"parentName,omitempty"`
	Results    *ResultsSnapshot        `json:"results,omitempty"`
}

type ResultsSnapshot struct {
	General         []ResultSnapshot `json:"general,omitempty"`
	Mountain        []ResultSnapshot `json:"mountain,omitempty"`
	Point           []ResultSnapshot `json:"point,omitempty"`
	Stage           []ResultSnapshot `json:"stage,omitempty"`
	OverallGeneral  []ResultSnapshot `json:"overallGeneral,omitempty"`
	OverallPoint    []ResultSnapshot `json:"overallPoint,omitempty"`
	OverallMountain []ResultSnapshot `json:"overallMountain,omitempty"`
}

type ResultSnapshot struct {
	Rank  int16         `json:"rank"`
	Rider RiderSnapshot `json:"rider"`
}

func ResultToSnapshot(result domain.Result) ResultSnapshot {
	snapshot := ResultSnapshot{}
	if result.Rank != nil {
		snapshot.Rank = *result.Rank
	}
	return snapshot
}

type RiderSnapshot struct {
	ID          uuid.UUID               `json:"id"`
	FirstName   string                  `json:"firstName"`
	LastName    string                  `json:"lastName"`
	Nationality *domain.CountrySnapshot `json:"nationality,omitempty"`
	Team        *TeamSnapshot           `json:"team,omitempty"`
}

func RiderToSnapshot(rider *domain.Rider) RiderSnapshot {
	var nat *domain.CountrySnapshot

	if rider.Nationality != nil {
		nat = &domain.CountrySnapshot{
			Alpha3: *rider.Nationality,
		}
	}

	return RiderSnapshot{
		ID:          rider.ID,
		FirstName:   rider.FirstName,
		LastName:    rider.LastName,
		Nationality: nat,
	}
}

type TeamSnapshot struct {
	ID           uuid.UUID               `json:"id"`
	Name         string                  `json:"name"`
	Abbreviation string                  `json:"abbreviation"`
	Country      *domain.CountrySnapshot `json:"country,omitempty"`
}
