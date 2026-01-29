package domain

import (
	"context"
	"cycling-backend/internal/common"
)

type SeasonStorage interface {
	FindOne(ctx context.Context, year int, gender common.Gender) (*Season, error)
}

