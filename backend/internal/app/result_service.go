package app

import (
	"context"

	"github.com/google/uuid"
	"github.com/rs/zerolog/log"
	"github.com/th-herve/cycling-app/backend/internal/app/storage"
	"github.com/th-herve/cycling-app/backend/internal/common"
	"github.com/th-herve/cycling-app/backend/pkg/domain"
)

type ResultService struct {
	storage        *storage.ResultStorage
	countryStorage *storage.CountryStorage
}

type ResultsByType = map[domain.ResultType][]domain.Result


type ResultHydrationContext struct {
	Countries storage.CountryMap
}

func NewResultService(storage *storage.ResultStorage, countryStorage *storage.CountryStorage) *ResultService {
	return &ResultService{storage: storage, countryStorage: countryStorage}
}

func (s *ResultService) FindManyByEventIDs(ctx context.Context, eventsID []uuid.UUID, options *storage.ResultSearchOptions) ([]domain.Result, error) {
	results, err := s.storage.FindManyByEventIDs(ctx, eventsID, options)

	if err != nil {
		log.Debug().
			Caller().
			Msg("Error getting many results")
		return nil, common.GetErr("ResultService FindManyByEventIds", err)
	}

	return results, nil
}

func (s *ResultService) FindByEventID(ctx context.Context, eventID uuid.UUID, options *storage.ResultSearchOptions) ([]domain.Result, error) {
	results, err := s.storage.FindByEventID(ctx, eventID, options)

	if err != nil {
		log.Debug().
			Caller().
			Str("eventID", eventID.String()).
			Msg("Error getting results for event")
		return nil, common.GetErr("ResultService FindManyByEventIds", err)
	}

	return results, nil
}
