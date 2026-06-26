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
	byID := make(map[uuid.UUID]dto.RiderDTO, len(riders))
	for _, r := range riders {
		byID[r.ID] = RiderToSnapshot(r)
	}
	return byID
}

// Converts list of Team to TeamSnapshot and map them by id.
func TeamsToSnapshotsByID(teams []*domain.TeamSeason) map[uuid.UUID]dto.TeamDTO {
	byID := make(map[uuid.UUID]dto.TeamDTO, len(teams))
	for _, t := range teams {
		byID[t.ID] = TeamToSnapshot(t)
	}
	return byID
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
		Category:     team.TeamCategoryCode,
		Country:      c,
	}
}

// Converts a result to a result DTO.
// Set the ids for the rider/team, but let the caller fully hydrate them.
func ResultToDTO(result domain.Result) dto.ResultDTO {
	var rider *dto.RiderDTO
	var team *dto.TeamDTO

	if result.RiderID != nil {
		rider = &dto.RiderDTO{
			ID: *result.RiderID,
		}
	}

	if result.TeamSeasonID != nil {
		team = &dto.TeamDTO{
			ID: *result.TeamSeasonID,
		}
	}

	return dto.ResultDTO{
		Rank:        result.Rank,
		Rider:       rider,
		Team:        team,
		Status:      result.Status,
		Points:      result.Points,
		TimeSeconds: result.TimeSeconds,
		Type:        result.Type,
	}
}

func ResultsToDTOs(results []domain.Result) []dto.ResultDTO {
	dtos := []dto.ResultDTO{}

	for _, res := range results {
		dtos = append(dtos, ResultToDTO(res))
	}

	return dtos
}

func ResultsDtoByType(resultsDTO []dto.ResultDTO) map[domain.ResultType][]dto.ResultDTO {
	byType := map[domain.ResultType][]dto.ResultDTO{}

	for _, res := range resultsDTO {
		if _, ok := byType[res.Type]; !ok {
			byType[res.Type] = make([]dto.ResultDTO, 0)
		}
		byType[res.Type] = append(byType[res.Type], res)
	}

	return byType
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

// ResultDtoToResponse takes a flat slice of ResultDTO
// and map them in a ResultsResponse.
func ResultDtoToResponse(resultDTO []dto.ResultDTO) dto.ResultsResponse {
	byType := ResultsDtoByType(resultDTO)

	return dto.ResultsResponse{
		General:  byType[domain.ResultTypeGeneral],
		Mountain: byType[domain.ResultTypeMountain],
		Point:    byType[domain.ResultTypePoint],
		Young:    byType[domain.ResultTypeYoung],

		Stage:           byType[domain.ResultTypeStageGeneral],
		OverallGeneral:  byType[domain.ResultTypeOverallGeneral],
		OverallPoint:    byType[domain.ResultTypeOverallPoint],
		OverallMountain: byType[domain.ResultTypeOverallMountain],
		OverallYoung:    byType[domain.ResultTypeOverallYoung],
	}
}

// MapValues takes a source composed of entities in a map and convert each value with a given mapper function.
// Returns a new map with each value converted using the mapper.
func MapValues[K comparable, T any, G any](source map[K]T, mapper func(T) G) map[K]G {
	mapped := make(map[K]G)

	for id, entity := range source {
		mapped[id] = mapper(entity)
	}

	return mapped
}
