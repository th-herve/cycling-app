package storage

import (
	"context"

	"github.com/Masterminds/squirrel"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"github.com/th-herve/cycling-app/backend/internal/common/db"
	"github.com/th-herve/cycling-app/backend/pkg/domain"
)

type TeamStorage struct {
	db *sqlx.DB
}

func NewTeamStorage(db *sqlx.DB) *TeamStorage {
	return &TeamStorage{db: db}
}

func (s *TeamStorage) FindById(ctx context.Context, teamId uuid.UUID) (domain.Team, error) {
	query, args, err := db.Q.Select("*").From("teams").Where(squirrel.Eq{"id": teamId.String()}).ToSql()

	if err != nil {
		return domain.Team{}, err
	}

	var team domain.Team

	err = s.db.QueryRow(query, args...).Scan(team)

	if err != nil {
		return domain.Team{}, err
	}

	return team, nil
}

func (s *TeamStorage) FindManyIds(ctx context.Context, teamsId []uuid.UUID) ([]*domain.Team, error) {
	query, args, err := db.Q.Select("*").From("teams").Where(squirrel.Eq{"id": teamsId}).ToSql()

	if err != nil {
		return nil, err
	}

	var teams []*domain.Team

	err = s.db.Select(&teams, query, args...)

	if err != nil {
		return nil, err
	}

	return teams, nil
}
