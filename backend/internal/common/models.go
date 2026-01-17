package common

import (
	"fmt"
	"time"
)

type Timestamps struct {
	CreatedAt time.Time  `db:"created_at" json:"createdAt"`
	UpdatedAt *time.Time `db:"updated_at" json:"updatedAt,omitempty"`
}

type Country struct {
	Alpha3      string `db:"alpha_3_code" json:"alpha3"`
	Alpha2      string `db:"alpha_2_code" json:"alpha2"`
	Name        string `db:"name" json:"name"`
	IocCode     string `db:"ioc_code"`
	NumericCode string `db:"numeric_code"`
	Region      string `db:"region"` // Europe, NA...

	Timestamps
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

type Gender string

const (
	GenderWomen Gender = "women"
	GenderMen   Gender = "men"
)

func ParseGender(s string) (Gender, error) {
	switch s {
	case string(GenderMen):
		return GenderMen, nil
	case string(GenderWomen):
		return GenderWomen, nil
	default:
		return "", fmt.Errorf("invalid gender: %s", s)
	}
}
