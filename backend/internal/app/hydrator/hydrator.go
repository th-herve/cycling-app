package hydrator

import (
	"github.com/google/uuid"
	"github.com/rs/zerolog/log"
	"github.com/th-herve/cycling-app/backend/internal/app/dto"
	"github.com/th-herve/cycling-app/backend/internal/app/mapper"
	"github.com/th-herve/cycling-app/backend/pkg/domain"
)

type EventHydrationContext struct {
	Countries   domain.CountryMap
	Results     []domain.Result
	Riders      []*domain.Rider
	Teams       []*domain.TeamSeason
	RidersTeams map[uuid.UUID]*domain.TeamSeason
}

type ResultHydrationContext struct {
	Countries domain.CountryMap
	Riders    []*domain.Rider
	Teams     []*domain.TeamSeason
}

func HydrateEventCountry(events []*dto.EventDTO, countryMap domain.CountryMap) {
	for _, event := range events {

		if event.CountryCode != nil {
			c, ok := countryMap[*event.CountryCode]

			if !ok {
				log.Warn().Caller().
					Str("countryCode", *event.CountryCode).
					Str("eventID", event.ID.String()).
					Msg("Could not retrieve country code from the country map")
				continue
			}

			event.Country = mapper.CountryToSnapshot(*c)
		}
	}
}

func HydrateEventResults(
	events []*dto.EventDTO,
	results []domain.Result,
	riderByID map[uuid.UUID]dto.RiderDTO,
	teamByID map[uuid.UUID]dto.TeamDTO,
	ridersTeams map[uuid.UUID]dto.TeamDTO,
	countries domain.CountryMap,
) {
	resultsSnapshotByEvent := make(map[uuid.UUID]map[domain.ResultType][]dto.ResultDTO)
	hasRider := len(riderByID) > 0
	hasTeam := len(teamByID) > 0 // Teams are for ttt stage result.
	hasCountry := len(countries) > 0

	for _, r := range results {
		res := mapper.ResultToDTO(r)

		// Mutually exclusive.
		isRider := r.RiderID != nil
		isTeam := r.TeamSeasonID != nil

		if isRider && isTeam {
			continue
		}
		if isRider && !hasRider {
			continue
		}
		if isTeam && !hasTeam {
			log.Warn().Caller().
				Str("resultID", r.ID.String()).
				Msg("result has both rider and team id")
			continue
		}

		if isRider {
			res = hydrateResultRider(res, riderByID, ridersTeams)
		}

		if isTeam {
			res = hydrateResultTeam(res, teamByID)
		}

		if hasCountry {
			res = hydrateResultCountry(res, countries)
		}

		if _, ok := resultsSnapshotByEvent[r.EventID]; !ok {
			resultsSnapshotByEvent[r.EventID] = make(map[domain.ResultType][]dto.ResultDTO)
		}
		resultsSnapshotByEvent[r.EventID][r.Type] = append(resultsSnapshotByEvent[r.EventID][r.Type], res)
	}

	for _, e := range events {
		e.Results = &dto.ResultsResponse{
			General:  resultsSnapshotByEvent[e.ID][domain.ResultTypeGeneral],
			Mountain: resultsSnapshotByEvent[e.ID][domain.ResultTypeMountain],
			Point:    resultsSnapshotByEvent[e.ID][domain.ResultTypePoint],
			Young:    resultsSnapshotByEvent[e.ID][domain.ResultTypeYoung],

			Stage:           resultsSnapshotByEvent[e.ID][domain.ResultTypeStageGeneral],
			OverallGeneral:  resultsSnapshotByEvent[e.ID][domain.ResultTypeOverallGeneral],
			OverallPoint:    resultsSnapshotByEvent[e.ID][domain.ResultTypeOverallPoint],
			OverallMountain: resultsSnapshotByEvent[e.ID][domain.ResultTypeOverallMountain],
			OverallYoung:    resultsSnapshotByEvent[e.ID][domain.ResultTypeOverallYoung],
		}
	}
}

func hydrateResultRider(res dto.ResultDTO, riderByID map[uuid.UUID]dto.RiderDTO, teamsByRider map[uuid.UUID]dto.TeamDTO) dto.ResultDTO {
	if res.Rider == nil {
		return res
	}
	rider, ok := riderByID[res.Rider.ID]
	if !ok {
		return res
	}
	res.Rider = &rider

	riderTeam, ok := teamsByRider[res.Rider.ID]
	if !ok {
		return res
	}
	res.Rider.Team = &riderTeam

	return res
}

func hydrateResultTeam(res dto.ResultDTO, teamByID map[uuid.UUID]dto.TeamDTO) dto.ResultDTO {
	if res.Team == nil {
		return res
	}
	team, ok := teamByID[res.Team.ID]
	if !ok {
		return res
	}
	res.Team = &team

	return res
}

func hydrateResultCountry(res dto.ResultDTO, countries domain.CountryMap) dto.ResultDTO {

	if res.Rider != nil && res.Rider.Nationality != nil {
		if c, ok := countries[res.Rider.Nationality.Alpha3]; ok {
			res.Rider.Nationality = mapper.CountryToSnapshot(*c)
		}
	}

	if res.Team != nil && res.Team.Country != nil {
		if c, ok := countries[res.Team.Country.Alpha3]; ok {
			res.Team.Country = mapper.CountryToSnapshot(*c)
		}
	}

	return res
}
