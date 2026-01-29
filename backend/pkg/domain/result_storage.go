package domain

import (
	"context"

	"github.com/google/uuid"
)

type ResultSearchOptions struct {
	Type []ResultType
	// >= 0, 0 meaning no limit
	Limit int
}

type ResultStorage interface {
	FindByEventId(ctx context.Context, eventId uuid.UUID, options *ResultSearchOptions) ([]Result, error)
	FindManyByEventIds(ctx context.Context, eventsId []uuid.UUID, options *ResultSearchOptions) ([]Result, error)
}
