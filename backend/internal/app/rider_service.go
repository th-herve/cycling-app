package app

import (
	"context"

	"github.com/google/uuid"
	"github.com/rs/zerolog/log"
	"github.com/th-herve/cycling-app/backend/internal/app/storage"
	"github.com/th-herve/cycling-app/backend/internal/common"
	"github.com/th-herve/cycling-app/backend/pkg/domain"
)

type RiderService struct {
	storage        *storage.RiderStorage
	countryStorage *storage.CountryStorage
}

func NewRiderService(storage *storage.RiderStorage, countryStorage *storage.CountryStorage) *RiderService {
	return &RiderService{storage: storage, countryStorage: countryStorage}
}

func (s *RiderService) FindByID(ctx context.Context, riderID uuid.UUID) (domain.Rider, error) {
	result, err := s.storage.FindByID(ctx, riderID)

	if err != nil {
		log.Debug().
			Caller().
			Msg("Error getting rider")
		return domain.Rider{}, common.GetErr("RiderService FindByID", err)
	}

	return result, nil
}

func (s *RiderService) FindManyByID(ctx context.Context, riderIDs []uuid.UUID) ([]*domain.Rider, error) {
	riders, err := s.storage.FindManyIDs(ctx, riderIDs)

	if err != nil {
		log.Debug().
			Caller().
			Msg("Error getting rider")
		return nil, common.GetErr("RiderService FindByID", err)
	}

	return riders, nil
}
