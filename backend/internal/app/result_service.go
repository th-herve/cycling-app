package app

import (
	"context"

	"github.com/google/uuid"
	"github.com/rs/zerolog/log"
	"github.com/th-herve/cycling-app/backend/internal/common"
	"github.com/th-herve/cycling-app/backend/pkg/domain"
)

type ResultService struct {
	storage        domain.ResultStorage
	countryStorage common.CountryStorage
}

type ResultsByType = map[domain.ResultType][]domain.Result


type ResultHydrationContext struct {
	Countries common.CountryMap
}

func NewResultService(storage domain.ResultStorage, countryStorage common.CountryStorage) *ResultService {
	return &ResultService{storage: storage, countryStorage: countryStorage}
}

func (s *ResultService) FindManyByEventIds(ctx context.Context, eventsId []uuid.UUID, options *domain.ResultSearchOptions) ([]domain.Result, error) {
	results, err := s.storage.FindManyByEventIds(ctx, eventsId, options)

	if err != nil {
		log.Debug().
			Caller().
			Msg("Error getting many results")
		return nil, common.GetErr("ResultService FindManyByEventIds", err)
	}

	return results, nil
}
