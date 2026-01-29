package domain

import (
	"context"

	"github.com/google/uuid"
)

type EventStorage interface {
	FindAllBySeason(ctx context.Context, seasonId uuid.UUID) ([]*Event, error)
}
