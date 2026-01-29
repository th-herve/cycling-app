package domain

import (
	"cycling-backend/internal/common"

	"github.com/google/uuid"
)

/*
* This entity group TeamSeason together to keep track of team changing name and other info through season
 */
type Team struct {
	ID uuid.UUID `db:"id" json:"id"`
	common.Timestamps
}

type TeamSeason struct {
	ID       uuid.UUID `db:"id" json:"id"`
	TeamID   uuid.UUID `db:"team_id" json:"parentTeamId"`
	SeasonID uuid.UUID `db:"season_id" json:"seasonId"`

	Name           string    `db:"name" json:"name"`
	Abbreviation   string    `db:"abbreviation" json:"abbreviation"`
	TeamCategoryID uuid.UUID `db:"team_category_id" json:"teamCategoryID"`
	CountryCode    *string   `db:"country_code" json:"countryCode,omitempty"`

	common.Timestamps
}
