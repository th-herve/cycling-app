package storage

import (
	"context"

	"github.com/Masterminds/squirrel"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"github.com/th-herve/cycling-app/backend/internal/common"
	"github.com/th-herve/cycling-app/backend/internal/common/db"
	"github.com/th-herve/cycling-app/backend/pkg/domain"
)

type ResultSearchOptions struct {
	Type []domain.ResultType
	// >= 0, 0 meaning no limit
	Limit int
}

type ResultStorage struct {
	db *sqlx.DB
}

func NewResultStorage(db *sqlx.DB) *ResultStorage {
	return &ResultStorage{db: db}
}

func (s *ResultStorage) FindManyByEventIDs(ctx context.Context, eventsId []uuid.UUID, options *ResultSearchOptions) ([]domain.Result, error) {
	queryBuilder := db.Q.Select("*").From("results").Where(squirrel.Eq{"event_id": eventsId})

	queryBuilder = s.applyOptions(queryBuilder, options)

	// Order by rank but put ranks 0 at the end. 0 is for DNS, DNF...
	// It works by first ordering by if the rank is eq 0. Where 0=0 -> 1 (true) and not0=0 -> 0 (false). So false>true in the order.
	queryBuilder = queryBuilder.OrderBy("event_id", "type", "rank = 0", "rank")

	query, args, err := queryBuilder.ToSql()

	if err != nil {
		return nil, err
	}

	var result []domain.Result

	err = s.db.Select(&result, query, args...)

	if err != nil {
		return nil, err
	}

	return result, nil
}

func (s *ResultStorage) FindByEventID(ctx context.Context, eventId uuid.UUID, options *ResultSearchOptions) ([]domain.Result, error) {

	queryBuilder := db.Q.Select("*").From("results").Where(squirrel.Eq{"event_id": eventId})

	queryBuilder = s.applyOptions(queryBuilder, options)

	queryBuilder = queryBuilder.OrderBy("type", "rank = 0", "rank")

	query, args, err := queryBuilder.ToSql()

	if err != nil {
		return nil, err
	}

	var results []domain.Result

	err = s.db.Select(&results, query, args...)

	if err != nil {
		return nil, err
	}

	return results, nil
}

func (s *ResultStorage) applyOptions(b squirrel.SelectBuilder, options *ResultSearchOptions) squirrel.SelectBuilder {

	if options == nil {
		return b
	}

	// The limit need to apply to each result type.
	// So we do `WHERE rank IN (acceptedRanks)`.
	if options.Limit > 0 {
		acceptedRanks := common.AscendingInts(options.Limit, false)
		b = b.Where(squirrel.Eq{"rank": acceptedRanks})
	}

	if len(options.Type) > 0 {
		b = b.Where(squirrel.Eq{"type": options.Type})
	}

	return b
}
