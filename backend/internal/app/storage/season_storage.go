package storage

import (
	"context"

	"github.com/Masterminds/squirrel"
	"github.com/jmoiron/sqlx"
	"github.com/th-herve/cycling-app/backend/internal/common/db"
	"github.com/th-herve/cycling-app/backend/pkg/domain"
)

type SeasonStorage struct {
	db *sqlx.DB
}

func NewSeasonStorage(db *sqlx.DB) *SeasonStorage {
	return &SeasonStorage{db: db}
}

func (s *SeasonStorage) FindOne(ctx context.Context, year int, gender domain.Gender) (*domain.Season, error) {

	var season domain.Season
	query, args, err := db.Q.Select("*").From("seasons").Where(squirrel.Eq{"year": year, "gender": gender}).ToSql()

	if err != nil {
		return nil, err
	}

	err = s.db.Get(&season, query, args...)

	if err != nil {
		return nil, err
	}

	return &season, nil
}
