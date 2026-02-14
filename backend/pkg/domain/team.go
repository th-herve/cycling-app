package domain

import (
	"github.com/google/uuid"
)

/*
* This entity group TeamSeason together to keep track of team changing name and other info through season
 */
type Team struct {
	ID   uuid.UUID `db:"id" json:"id"`
	Name *string   `db:"name" json:"name"`
	Timestamps
}

type TeamSeason struct {
	ID               uuid.UUID `db:"id" json:"id"`
	TeamID           uuid.UUID `db:"team_id" json:"parentTeamId"`
	SeasonYear       int       `db:"season_year" json:"seasonYear"`
	SeasonGender     Gender    `db:"season_gender" json:"seasonGender"`
	Name             string    `db:"name" json:"name"`
	Abbreviation     string    `db:"abbreviation" json:"abbreviation"`
	TeamCategoryCode string    `db:"team_category_code" json:"teamCategoryCode"`
	CountryCode      *string   `db:"country_code" json:"countryCode,omitempty"`

	Timestamps
}

type TeamCategory struct {
	Code           string `db:"code" json:"code"`
	Name           string `db:"name" json:"name"`
	DisciplineCode string `db:"discipline_code" json:"discipline"`
	Gender         Gender `db:"gender" json:"gender"`
}
