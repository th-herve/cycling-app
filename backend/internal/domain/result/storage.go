package result

import (
	"context"
	"cycling-backend/internal/common"
	"cycling-backend/internal/common/db"
	"log"

	"github.com/Masterminds/squirrel"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type ResultSearchOptions struct {
	Type []ResultType
	// >= 0, 0 meaning no limit
	Limit int
}

type Storage interface {
	FindByEventId(ctx context.Context, eventId uuid.UUID, options *ResultSearchOptions) ([]Result, error)
	FindManyByEventIds(ctx context.Context, eventsId []uuid.UUID, options *ResultSearchOptions) ([]Result, error)
}

type storage struct {
	db *sqlx.DB
}

func NewResultStorage(db *sqlx.DB) Storage {
	return &storage{db: db}
}

func (s *storage) FindManyByEventIds(ctx context.Context, eventsId []uuid.UUID, options *ResultSearchOptions) ([]Result, error) {
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

	var result []Result

	err = s.db.Select(&result, query, args...)

	if err != nil {
		return nil, err
	}

	return result, nil
}

func (s *storage) FindByEventId(ctx context.Context, eventId uuid.UUID, options *ResultSearchOptions) ([]Result, error) {

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

	var results []Result

	err = s.db.Select(&results, query, args...)

	if err != nil {
		return nil, err
	}

	return results, nil
}
