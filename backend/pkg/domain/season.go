package domain

import (
	"github.com/google/uuid"
	"github.com/th-herve/cycling-app/backend/internal/common"
)

type Season struct {
	ID     uuid.UUID     `db:"id" json:"id"`
	Gender common.Gender `db:"gender" json:"gender"`
	Year   int           `db:"year" json:"year"`

	common.Timestamps
}
