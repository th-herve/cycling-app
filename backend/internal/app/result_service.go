package app

import (
	"context"
	"cycling-backend/internal/common"
	"cycling-backend/internal/domain/result"

	"github.com/google/uuid"
	"github.com/rs/zerolog/log"
)

type ResultService struct {
	storage        result.Storage
	countryStorage common.CountryStorage
}

type ResultsByType = map[result.ResultType][]result.Result


type ResultHydrationContext struct {
	Countries common.CountryMap
}

func NewResultService(storage result.Storage, countryStorage common.CountryStorage) *ResultService {
	return &ResultService{storage: storage, countryStorage: countryStorage}
}

func (s *ResultService) FindManyByEventIds(ctx context.Context, eventsId []uuid.UUID, options *result.ResultSearchOptions) ([]result.Result, error) {
	results, err := s.storage.FindManyByEventIds(ctx, eventsId, options)

	if err != nil {
		log.Debug().
			Caller().
			Msg("Error getting many results")
		return nil, common.GetErr("ResultService FindManyByEventIds", err)
	}

	return results, nil
}
