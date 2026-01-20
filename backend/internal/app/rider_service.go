package app

import (
	"context"
	"cycling-backend/internal/common"
	"cycling-backend/internal/domain/rider"

	"github.com/google/uuid"
	"github.com/rs/zerolog/log"
)

type RiderService struct {
	storage        rider.Storage
	countryStorage common.CountryStorage
}

func NewRiderService(storage rider.Storage, countryStorage common.CountryStorage) *RiderService {
	return &RiderService{storage: storage, countryStorage: countryStorage}
}

func (s *RiderService) FindById(ctx context.Context, riderId uuid.UUID) (rider.Rider, error) {
	result, err := s.storage.FindById(ctx, riderId)

	if err != nil {
		log.Debug().
			Caller().
			Msg("Error getting rider")
		return rider.Rider{}, common.GetErr("RiderService FindById", err)
	}

	return result, nil
}

func (s *RiderService) FindManyById(ctx context.Context, riderIds []uuid.UUID) ([]rider.Rider, error) {
	riders, err := s.storage.FindManyIds(ctx, riderIds)

	if err != nil {
		log.Debug().
			Caller().
			Msg("Error getting rider")
		return nil, common.GetErr("RiderService FindById", err)
	}

	return riders, nil
}
