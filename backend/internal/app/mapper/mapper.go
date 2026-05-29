package mapper

import (
	"github.com/google/uuid"
	"github.com/th-herve/cycling-app/backend/internal/app/dto"
	"github.com/th-herve/cycling-app/backend/pkg/domain"
)

// Converts a list of Events to DTO.
func EventsToDTO(events []*domain.Event) []*dto.EventDTO {
	response := make([]*dto.EventDTO, 0, len(events))
	for _, event := range events {
		eventResp := dto.EventDTO{
			Event: *event,
		}
		response = append(response, &eventResp)
	}

	return response
}

// Converts list of Rider to RiderSnapshot and map them by id.
func RidersToSnapshotsByID(riders []*domain.Rider) map[uuid.UUID]dto.RiderDTO {
	byId := make(map[uuid.UUID]dto.RiderDTO, len(riders))
	for _, r := range riders {
		byId[r.ID] = RiderToSnapshot(r) // TODO hydrate country in hydrator
	}
	return byId
}

// Converts list of Team to TeamSnapshot and map them by id.
func TeamsToSnapshotsByID(teams []*domain.TeamSeason) map[uuid.UUID]dto.TeamDTO {
	byId := make(map[uuid.UUID]dto.TeamDTO, len(teams))
	for _, t := range teams {
		byId[t.ID] = TeamToSnapshot(t) // TODO hydrate country in hydrator
	}
	return byId
}

// Converts a rider to a rider snapshot.
func RiderToSnapshot(rider *domain.Rider) dto.RiderDTO {
	var nat *dto.CountryDTO

	if rider.Nationality != nil {
		nat = &dto.CountryDTO{
			Alpha3: *rider.Nationality,
		}
	}

	return dto.RiderDTO{
		ID:          rider.ID,
		FirstName:   rider.FirstName,
		LastName:    rider.LastName,
		Nationality: nat,
	}
}

// Converts a TeamSeason to a team snapshot.
func TeamToSnapshot(team *domain.TeamSeason) dto.TeamDTO {
	var c *dto.CountryDTO

	if team.CountryCode != nil {
		c = &dto.CountryDTO{
			Alpha3: *team.CountryCode,
		}
	}

	return dto.TeamDTO{
		ID:           team.ID,
		Name:         team.Name,
		Abbreviation: team.Abbreviation,
		Country:      c,
	}
}

// Converts a result to a result snapshot (DTO with only the rank added).
// Let the caller hydrate the rider/team.
func ResultToSnapshot(result domain.Result) dto.ResultDTO {
	return dto.ResultDTO{
		Rank: result.Rank,
	}
}

// Converts a result to a result DTO.
// Let the caller hydrate the rider/team.
func ResultToDTO(result domain.Result) dto.ResultDTO {
	return dto.ResultDTO{
		Rank:        result.Rank,
		Status:      result.Status,
		Points:      result.Points,
		TimeSeconds: result.TimeSeconds,
	}
}


func CountryToSnapshot(country domain.Country) *dto.CountryDTO {
	return &dto.CountryDTO{
		Alpha3: country.Alpha3,
		Alpha2: country.Alpha2,
		Name:   country.Name,
	}
}

// ToHasCountryCodeSlice take a slice of entity implementing HasCountryCode
// and convert them to HasCountryCode.
func ToHasCountryCodeSlice[T domain.HasCountryCode](items []T) []domain.HasCountryCode {
	result := make([]domain.HasCountryCode, len(items))

	for i, item := range items {
		result[i] = item
	}

	return result
}
