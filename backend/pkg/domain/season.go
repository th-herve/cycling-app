package domain

import (
	"cycling-backend/internal/common"

	"github.com/google/uuid"
)

type Season struct {
	ID     uuid.UUID     `db:"id" json:"id"`
	Gender common.Gender `db:"gender" json:"gender"`
	Year   int           `db:"year" json:"year"`

	common.Timestamps
}
