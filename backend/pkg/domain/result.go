package domain

import (
	"cycling-backend/internal/common"

	"github.com/google/uuid"
)

type ResultType string

const (
	// Stage results
	ResultTypeStageGeneral  ResultType = "stage_general"
	ResultTypeStageMountain ResultType = "stage_mountain"
	ResultTypeStagePoint    ResultType = "stage_point"
	ResultTypeStageYoung    ResultType = "stage_young"
	ResultTypeStageTeam     ResultType = "stage_team"

	// Overall after a stage
	ResultTypeOverallGeneral  ResultType = "overall_general"
	ResultTypeOverallMountain ResultType = "overall_mountain"
	ResultTypeOverallPoint    ResultType = "overall_point"
	ResultTypeOverallYoung    ResultType = "overall_young"
	ResultTypeOverallTeam     ResultType = "overall_team"

	// Final results
	ResultTypeGeneral  ResultType = "general"
	ResultTypeMountain ResultType = "mountain"
	ResultTypePoint    ResultType = "point"
	ResultTypeYoung    ResultType = "young"
	ResultTypeTeam     ResultType = "team"
)

type ResultStatus string

const (
	ResultStatusDNF ResultStatus = "DNF"
	ResultStatusDNS ResultStatus = "DNS"
	ResultStatusOTL ResultStatus = "OTL"
)

type Result struct {
	ID           uuid.UUID     `db:"id" json:"id"`
	Type         ResultType    `db:"type" json:"type"`
	EventID      uuid.UUID     `db:"event_id" json:"eventId"`
	RiderID      *uuid.UUID    `db:"rider_id,omitempty" json:"riderId,omitempty"`
	TeamSeasonID *uuid.UUID    `db:"team_season_id,omitempty" json:"teamSeasonId,omitempty"`
	Rank         *int16        `db:"rank,omitempty" json:"rank,omitempty"`
	Status       *ResultStatus `db:"status,omitempty" json:"status,omitempty"`
	TimeSeconds  *int32        `db:"time_seconds,omitempty" json:"timeSeconds,omitempty"`
	Points       *int16        `db:"points,omitempty" json:"points,omitempty"`
	UCIPoints    *int16        `db:"uci_points,omitempty" json:"uciPoints,omitempty"`

	common.Timestamps
}
