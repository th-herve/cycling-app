package common

import (
	"database/sql"
	"errors"
	"fmt"
)

var (
	ErrInternal     = errors.New("internal error")
	ErrDatabase     = errors.New("database error")
	ErrNotFound     = errors.New("not found")
	ErrInvalidInput = errors.New("invalid input")
)

func GetErr(context string, err error) error {
	switch {
	case errors.Is(err, sql.ErrNoRows):
		return fmt.Errorf("%s %w: %w", context, ErrNotFound, err)
	case errors.Is(err, sql.ErrConnDone), errors.Is(err, sql.ErrTxDone):
		return fmt.Errorf("%s %w: %w", context, ErrDatabase, err)
	}
	return fmt.Errorf("%s %w: %w", context, ErrInternal, err)
}
