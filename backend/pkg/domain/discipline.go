package domain

import (
	"github.com/google/uuid"
	"github.com/th-herve/cycling-app/backend/internal/common"
)

type Discipline struct {
	ID   uuid.UUID `db:"id" json:"id"`
	Name string    `db:"name" json:"name"`
	Code string    `db:"code" json:"code,omitempty"`

	common.Timestamps
}

type Category struct {
	ID           uuid.UUID `db:"id" json:"id"`
	Name         string    `db:"name" json:"name"`
	DisciplineID uuid.UUID `db:"discipline_id" json:"disciplineId"`
	Code         string    `db:"code" json:"code"`

	common.Timestamps
}
