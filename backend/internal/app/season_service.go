package app

import (
	"context"
	"cycling-backend/internal/common"
	"cycling-backend/internal/domain/season"
)

type SeasonService struct {
	storage season.Storage
}

func NewSeasonService(storage season.Storage) *SeasonService {
	return &SeasonService{storage: storage}
}

func (s *SeasonService) FindOne(ctx context.Context, year int, gender common.Gender) (*season.Season, error) {
	season, err := s.storage.FindOne(ctx, year, gender)

	if err != nil {
		return nil, common.GetErr("SeasonService FindOne", err)
	}

	return season, nil
}
