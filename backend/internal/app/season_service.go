package app

import (
	"context"
	"cycling-backend/internal/common"
	"cycling-backend/pkg/domain"
)

type SeasonService struct {
	storage domain.SeasonStorage
}

func NewSeasonService(storage domain.SeasonStorage) *SeasonService {
	return &SeasonService{storage: storage}
}

func (s *SeasonService) FindOne(ctx context.Context, year int, gender common.Gender) (*domain.Season, error) {
	season, err := s.storage.FindOne(ctx, year, gender)

	if err != nil {
		return nil, common.GetErr("SeasonService FindOne", err)
	}

	return season, nil
}
