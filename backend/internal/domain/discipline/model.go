package discipline

import (
	"cycling-backend/internal/common"

	"github.com/google/uuid"
)

type Discipline struct {
	ID   uuid.UUID `db:"id" json:"id"`
	Name string    `db:"name" json:"name"`
	Code *string   `db:"code" json:"code,omitempty"`

	common.Timestamps
}

type Category struct {
	ID           uuid.UUID `db:"id" json:"id"`
	Name         string    `db:"name" json:"name"`
	DisciplineID uuid.UUID `db:"discipline_id" json:"disciplineId"`
	Code         string    `db:"code" json:"code"`

	common.Timestamps
}
