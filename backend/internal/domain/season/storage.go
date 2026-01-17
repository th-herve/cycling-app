package season

import (
	"context"
	"cycling-backend/internal/common"
	"cycling-backend/internal/common/db"

	"github.com/Masterminds/squirrel"
	"github.com/jmoiron/sqlx"
)

type Storage interface {
	FindOne(ctx context.Context, year int, gender common.Gender) (*Season, error)
}

type storage struct {
	db *sqlx.DB
}

func NewSeasonStorage(db *sqlx.DB) Storage {
	return &storage{db: db}
}

func (s *storage) FindOne(ctx context.Context, year int, gender common.Gender) (*Season, error) {

	var season Season
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
