package app

import (
	"github.com/google/uuid"
	"github.com/rs/zerolog/log"
	"github.com/th-herve/cycling-app/backend/pkg/domain"
)

func collectRidersId(results []domain.Result) []uuid.UUID {
	seen := map[uuid.UUID]bool{}
	ridersId := []uuid.UUID{}

	for _, r := range results {
		riderId := r.RiderID
		if riderId == nil {
			log.Warn().
				Caller().
				Str("result_id", r.ID.String()).
				Str("result_type", string(r.Type)).
				Msg("result without rider id found")
			continue
		}

		_, saw := seen[*riderId]
		if saw {
			continue
		}

		ridersId = append(ridersId, *riderId)
		seen[*riderId] = true
	}

	return ridersId
}
