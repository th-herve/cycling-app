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
	Results    *ResultsResponse        `json:"results,omitempty"`
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

func TeamToSnapshot(team *domain.TeamSeason) TeamSnapshot {
	var c *domain.CountrySnapshot

	if team.CountryCode != nil {
		c = &domain.CountrySnapshot{
			Alpha3: *team.CountryCode,
		}
	}

	return TeamSnapshot{
		ID:           team.ID,
		Name:         team.Name,
		Abbreviation: team.Abbreviation,
		Country:      c,
	}
}
