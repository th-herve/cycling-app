package app

import (
	"github.com/google/uuid"
	"github.com/th-herve/cycling-app/backend/internal/common"
	"github.com/th-herve/cycling-app/backend/pkg/domain"
)

type EventResponse struct {
	domain.Event
	Country    *common.CountrySnapshot `json:"country,omitempty"`
	Stages     []*EventResponse        `json:"stages,omitempty"`
	ParentName *string                 `json:"parentName,omitempty"`
	Results    *ResultsSnapshot        `json:"results,omitempty"`
}

type ResultsSnapshot struct {
	General  []ResultSnapshot `json:"general,omitempty"`
	Mountain []ResultSnapshot `json:"mountain,omitempty"`
	Point    []ResultSnapshot `json:"point,omitempty"`
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
	Nationality *common.CountrySnapshot `json:"nationality,omitempty"`
	Team        *TeamSnapshot           `json:"team,omitempty"`
}

func RiderToSnapshot(rider domain.Rider) RiderSnapshot {
	return RiderSnapshot{
		ID: rider.ID,
		FirstName: rider.FirstName,
		LastName: rider.LastName,
	}
}

type TeamSnapshot struct {
	ID           uuid.UUID               `json:"id"`
	Name         string                  `json:"name"`
	Abbreviation string                  `json:"abbreviation"`
	Country      *common.CountrySnapshot `json:"country,omitempty"`
}
