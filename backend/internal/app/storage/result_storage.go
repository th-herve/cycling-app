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

type resultStorage struct {
	db *sqlx.DB
}

func NewResultStorage(db *sqlx.DB) domain.ResultStorage {
	return &resultStorage{db: db}
}

func (s *resultStorage) FindManyByEventIds(ctx context.Context, eventsId []uuid.UUID, options *domain.ResultSearchOptions) ([]domain.Result, error) {
	queryBuilder := db.Q.Select("*").From("results").Where(squirrel.Eq{"event_id": eventsId})

	// since we don't just want to limit the number of row returned, but limit for each result type,
	// we instead query for the all the rank in the limit for each type.
	if options != nil && options.Limit > 0 {
		acceptedRanks := common.AscendingInts(options.Limit, false)
		queryBuilder = queryBuilder.Where(squirrel.Eq{"rank": acceptedRanks})
	}

	if options != nil && len(options.Type) > 0 {
		queryBuilder = queryBuilder.Where(squirrel.Eq{"type": options.Type})
	}

	// order by rank but put ranks 0 at the end. 0 is for DNS, DNF...
	// it work by first ordering by if the rank is eq 0. Where 0=0 -> 1 (true) and not0=0 -> 0 (false). So false>true in the order.
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

func (s *resultStorage) FindByEventId(ctx context.Context, eventId uuid.UUID, options *domain.ResultSearchOptions) ([]domain.Result, error) {

	queryBuilder := db.Q.Select("*").From("results").Where(squirrel.Eq{"event_id": eventId})

	// since we don't just want to limit the number of row returned, but limit for each result type,
	// we instead query for the all the rank in the limit for each type.
	if options != nil && options.Limit > 0 {
		acceptedRanks := common.AscendingInts(options.Limit, false)
		queryBuilder.Where(squirrel.Eq{"rank": acceptedRanks})
	}

	// order by rank but put ranks 0 at the end. 0 is for DNS, DNF...
	// it work by first ordering by if the rank is eq 0. Where 0=0 -> 1 (true) and not0=0 -> 0 (false). So false>true in the order.
	queryBuilder.OrderBy("type", "rank = 0", "rank")

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
