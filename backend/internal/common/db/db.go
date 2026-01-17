package db

import (
	sq "github.com/Masterminds/squirrel"
)

var Q = sq.StatementBuilder.PlaceholderFormat(sq.Dollar)
