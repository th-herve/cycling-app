package storage

import (
	"context"

	"github.com/Masterminds/squirrel"
	"github.com/jmoiron/sqlx"
	"github.com/th-herve/cycling-app/backend/internal/common/db"
	"github.com/th-herve/cycling-app/backend/pkg/domain"
)

type CountryStorage struct {
	db *sqlx.DB
}

func NewCountryStorageStorage(db *sqlx.DB) *CountryStorage {
	return &CountryStorage{db: db}
}

func (s *CountryStorage) FindOneByAlpha3Code(ctx context.Context, code string) (*domain.Country, error) {

	var country domain.Country
	query, args, err := db.Q.Select("*").From("countries").Where(squirrel.Eq{"alpha_3_code": code}).ToSql()

	if err != nil {
		return nil, err
	}

	err = s.db.Get(&country, query, args...)

	if err != nil {
		return nil, err
	}

	return &country, nil
}

func (s *CountryStorage) FindManyByAlpha3Code(ctx context.Context, codes []string) (domain.CountryMap, error) {

	query, args, err := db.Q.Select("*").From("countries").Where(squirrel.Eq{"alpha_3_code": codes}).ToSql()

	if err != nil {
		return nil, err
	}

	countries := []*domain.Country{}

	err = s.db.Select(&countries, query, args...)

	if err != nil {
		return nil, err
	}

	return s.groupByCode(countries), nil
}

func (s *CountryStorage) groupByCode(countries []*domain.Country) domain.CountryMap {
	result := domain.CountryMap{}

	for _, country := range countries {
		result[country.Alpha3] = country
	}

	return result
}
