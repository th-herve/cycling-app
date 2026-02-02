package domain

import (
	"github.com/th-herve/cycling-app/backend/internal/common"
)

type Country struct {
	Alpha3      string `db:"alpha_3_code" json:"alpha3"`
	Alpha2      string `db:"alpha_2_code" json:"alpha2"`
	Name        string `db:"name" json:"name"`
	IocCode     string `db:"ioc_code"`
	NumericCode string `db:"numeric_code"`
	Region      string `db:"region"` // Europe, NA...

	common.Timestamps
}

type CountrySnapshot struct {
	Alpha3 string `json:"alpha3"`
	Alpha2 string `json:"alpha2"`
	Name   string `json:"name"`
}

func CountryToSnapshot(country Country) *CountrySnapshot {
	return &CountrySnapshot{
		Alpha3: country.Alpha3,
		Alpha2: country.Alpha2,
		Name:   country.Name,
	}
}
