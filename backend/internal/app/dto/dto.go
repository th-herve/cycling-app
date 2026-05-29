package dto

import (
	"github.com/google/uuid"
	"github.com/th-herve/cycling-app/backend/pkg/domain"
)

type EventDTO struct {
	domain.Event
	Country    *CountryDTO      `json:"country,omitempty"`
	Stages     []*EventDTO      `json:"stages,omitempty"`
	ParentName *string          `json:"parentName,omitempty"`
	Results    *ResultsResponse `json:"results,omitempty"`
}

type RiderDTO struct {
	ID          uuid.UUID   `json:"id"`
	FirstName   string      `json:"firstName"`
	LastName    string      `json:"lastName"`
	Nationality *CountryDTO `json:"nationality,omitempty"`
	Team        *TeamDTO    `json:"team,omitempty"`
}

type TeamDTO struct {
	ID           uuid.UUID   `json:"id"`
	Name         string      `json:"name"`
	Abbreviation string      `json:"abbreviation"`
	Country      *CountryDTO `json:"country,omitempty"`
}

type ResultsResponse struct {
	General  []ResultDTO `json:"general,omitempty"`
	Mountain []ResultDTO `json:"mountain,omitempty"`
	Point    []ResultDTO `json:"point,omitempty"`
	Young    []ResultDTO `json:"young,omitempty"`

	Stage           []ResultDTO `json:"stage,omitempty"`
	OverallGeneral  []ResultDTO `json:"overallGeneral,omitempty"`
	OverallPoint    []ResultDTO `json:"overallPoint,omitempty"`
	OverallMountain []ResultDTO `json:"overallMountain,omitempty"`
	OverallYoung    []ResultDTO `json:"overallYoung,omitempty"`
}

type ResultDTO struct {
	Rank        *int16               `json:"rank,omitzero"` // Omitzero because 0 means a special status apply (DNF,DNS...).
	Rider       *RiderDTO            `json:"rider,omitempty"`
	Team        *TeamDTO             `json:"team,omitempty"`
	Status      *domain.ResultStatus `json:"status,omitempty"`
	Points      *int16               `json:"points,omitempty"`
	TimeSeconds *int32               `json:"time_seconds,omitempty"`
	GapSeconds  *int32               `json:"gap_seconds,omitempty"`
}

type CountryDTO struct {
	Alpha3 string `json:"alpha3"`
	Alpha2 string `json:"alpha2"`
	Name   string `json:"name"`
}
