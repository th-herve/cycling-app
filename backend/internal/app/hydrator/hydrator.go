package hydrator

import (
	"github.com/google/uuid"
	"github.com/rs/zerolog/log"
	"github.com/th-herve/cycling-app/backend/internal/app/dto"
	"github.com/th-herve/cycling-app/backend/internal/app/mapper"
	"github.com/th-herve/cycling-app/backend/pkg/domain"
)

type EventHydrationContext struct {
	Countries domain.CountryMap
	Results   []domain.Result
	Riders    []*domain.Rider
	Teams     []*domain.TeamSeason
}

func HydrateCountry(events []*dto.EventDTO, countryMap domain.CountryMap) {
	for _, event := range events {

		if event.CountryCode != nil {
			c, ok := countryMap[*event.CountryCode]

			if !ok {
				log.Warn().Caller().
					Str("countryCode", *event.CountryCode).
					Str("eventId", event.ID.String()).
					Msg("Could not retrieve country code from the country map")
				continue
			}

			event.Country = mapper.CountryToSnapshot(*c)
		}
	}
}

func HydrateResults(events []*dto.EventDTO, results []domain.Result, riderByID map[uuid.UUID]dto.RiderDTO, teamByID map[uuid.UUID]dto.TeamDTO) {
	resultsSnapshotByEvent := make(map[uuid.UUID]map[domain.ResultType][]dto.ResultDTO)
	hydrateRider := len(riderByID) > 0
	hydrateTeam := len(teamByID) > 0 // Teams are for ttt stage result.

	for _, r := range results {
		res := mapper.ResultToSnapshot(r)
		if hydrateRider && r.RiderID != nil {
			if rs, ok := riderByID[*r.RiderID]; ok {
				res.Rider = &rs
			}
		}
		if r.RiderID == nil && hydrateTeam && r.TeamSeasonID != nil {
			if t, ok := teamByID[*r.TeamSeasonID]; ok {
				res.Team = &t
			}
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
