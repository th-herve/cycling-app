package domain

import (
	"cycling-backend/internal/common"
	"time"

	"github.com/google/uuid"
)

type Rider struct {
	ID          uuid.UUID     `db:"id" json:"id"`
	FirstName   string        `db:"first_name" json:"firstName"`
	LastName    string        `db:"last_name" json:"lastName"`
	BirthDate   *time.Time    `db:"birth_date" json:"birthDate"`
	Nationality *string       `db:"nationality" json:"countryCode,omitempty"`
	Gender      common.Gender `db:"gender" json:"gender"`

	common.Timestamps
}
