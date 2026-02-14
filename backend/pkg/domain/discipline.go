package domain

type Discipline struct {
	Code string `db:"code" json:"code,omitempty"`
	Name string `db:"name" json:"name"`

	Timestamps
}

type Category struct {
	Code           string `db:"code" json:"code"`
	Name           string `db:"name" json:"name"`
	DisciplineCode string `db:"discipline_code" json:"disciplineCode"`
	Gender         Gender `db:"gender" json:"gender"`

	Timestamps
}
