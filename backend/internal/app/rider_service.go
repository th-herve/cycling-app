package app

import (
	"context"

	"github.com/google/uuid"
	"github.com/rs/zerolog/log"
	"github.com/th-herve/cycling-app/backend/internal/common"
	"github.com/th-herve/cycling-app/backend/pkg/domain"
)

type RiderService struct {
	storage        domain.RiderStorage
	countryStorage common.CountryStorage
}

func NewRiderService(storage domain.RiderStorage, countryStorage common.CountryStorage) *RiderService {
	return &RiderService{storage: storage, countryStorage: countryStorage}
}

func (s *RiderService) FindById(ctx context.Context, riderId uuid.UUID) (domain.Rider, error) {
	result, err := s.storage.FindById(ctx, riderId)

	if err != nil {
		log.Debug().
			Caller().
			Msg("Error getting rider")
		return domain.Rider{}, common.GetErr("RiderService FindById", err)
	}

	return result, nil
}

func (s *RiderService) FindManyById(ctx context.Context, riderIds []uuid.UUID) ([]domain.Rider, error) {
	riders, err := s.storage.FindManyIds(ctx, riderIds)

	if err != nil {
		log.Debug().
			Caller().
			Msg("Error getting rider")
		return nil, common.GetErr("RiderService FindById", err)
	}

	return riders, nil
}
