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
	storage        *storage.TeamStorage
}

func NewTeamService(storage *storage.TeamStorage) *TeamService {
	return &TeamService{storage: storage}
}

func (s *TeamService) FindById(ctx context.Context, teamId uuid.UUID) (domain.Team, error) {
	result, err := s.storage.FindById(ctx, teamId)

	if err != nil {
		log.Debug().
			Caller().
			Msg("Error getting team")
		return domain.Team{}, common.GetErr("TeamService FindById", err)
	}

	return result, nil
}

func (s *TeamService) FindManyById(ctx context.Context, teamIds []uuid.UUID) ([]*domain.Team, error) {
	teams, err := s.storage.FindManyIds(ctx, teamIds)

	if err != nil {
		log.Debug().
			Caller().
			Msg("Error getting team")
		return nil, common.GetErr("TeamService FindById", err)
	}

	return teams, nil
}
