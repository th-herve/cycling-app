package domain

import (
	"context"

	"github.com/th-herve/cycling-app/backend/internal/common"
)

type SeasonStorage interface {
	FindOne(ctx context.Context, year int, gender common.Gender) (*Season, error)
}

