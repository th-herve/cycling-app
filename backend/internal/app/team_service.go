package app

import (
	"context"

	"github.com/google/uuid"
	"github.com/rs/zerolog/log"
	"github.com/th-herve/cycling-app/backend/internal/app/storage"
	"github.com/th-herve/cycling-app/backend/internal/common"
	"github.com/th-herve/cycling-app/backend/pkg/domain"
)

type TeamService struct {
	storage *storage.TeamStorage
}

func NewTeamService(storage *storage.TeamStorage) *TeamService {
	return &TeamService{storage: storage}
}

func (s *TeamService) FindByID(ctx context.Context, teamID uuid.UUID) (domain.TeamSeason, error) {
	result, err := s.storage.FindByID(ctx, teamID)

	if err != nil {
		log.Debug().
			Caller().
			Msg("Error getting team")
		return domain.TeamSeason{}, common.GetErr("TeamService FindByID", err)
	}

	return result, nil
}

func (s *TeamService) FindManyByID(ctx context.Context, teamIDs []uuid.UUID) ([]*domain.TeamSeason, error) {
	teams, err := s.storage.FindManyIDs(ctx, teamIDs)

	if err != nil {
		log.Debug().
			Caller().
			Msg("Error getting team")
		return nil, common.GetErr("TeamService FindByID", err)
	}

	return teams, nil
}

func (s *TeamService) FindManyByRiderIDAndSeason(ctx context.Context, riderIDs []uuid.UUID, seasonYear int) (map[uuid.UUID]*domain.TeamSeason, error) {
	teamByRiderIDs, err := s.storage.FindManyByRiderIDsAndSeason(ctx, riderIDs, seasonYear)

	if err != nil {
		log.Debug().
			Caller().
			Err(err).
			Msg("Error getting teams for riders")
		return nil, common.GetErr("TeamService FindManyByRiderIDsAndSeason", err)
	}

	return teamByRiderIDs, nil
}
