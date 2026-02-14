package domain

type Season struct {
	Gender Gender `db:"gender" json:"gender"`
	Year   int    `db:"year" json:"year"`

	Timestamps
}
