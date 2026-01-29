package common

import (
	"context"

	"github.com/Masterminds/squirrel"
	"github.com/jmoiron/sqlx"
	"github.com/th-herve/cycling-app/backend/internal/common/db"
)


type CountryMap map[string]*Country

type CountryStorage interface {
	FindOneByAlpha3Code(ctx context.Context, code string) (*Country, error)
	FindManyByAlpha3Code(ctx context.Context, codes []string) (CountryMap, error)
}

type countryStorage struct {
	db *sqlx.DB
}

func NewCountryStorageStorage(db *sqlx.DB) CountryStorage {
	return &countryStorage{db: db}
}

func (s *countryStorage) FindOneByAlpha3Code(ctx context.Context, code string) (*Country, error) {

	var country Country
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

func (s *countryStorage) FindManyByAlpha3Code(ctx context.Context, codes []string) (CountryMap, error) {

	query, args, err := db.Q.Select("*").From("countries").Where(squirrel.Eq{"alpha_3_code": codes}).ToSql()

	if err != nil {
		return nil, err
	}

	countries := []*Country{}

	err = s.db.Select(&countries, query, args...)

	if err != nil {
		return nil, err
	}

	return s.groupByCode(countries), nil
}

func (s *countryStorage) groupByCode(countries []*Country) CountryMap {
	result := CountryMap{}

	for _, country := range countries {
		result[country.Alpha3] = country
	}

	return result
}
