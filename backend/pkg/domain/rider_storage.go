package domain

import (
	"context"

	"github.com/google/uuid"
)

type RiderStorage interface {
	FindById(ctx context.Context, riderId uuid.UUID) (Rider, error)
	FindManyIds(ctx context.Context, ridersId []uuid.UUID) ([]Rider, error)
}

