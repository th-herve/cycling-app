package domain

import (
	"time"

	"github.com/google/uuid"
	"github.com/th-herve/cycling-app/backend/internal/common"
)

type EventType string
type EventStatus string
type EventClassifcation string

const (
	EventTypeRace  EventType = "race"
	EventTypeStage EventType = "stage"

	EventStatusCanceled   EventStatus = "canceled"
	EventStatusFinished   EventStatus = "finished"
	EventStatusPostponed  EventStatus = "postponed"
	EventStatusNotStarted EventStatus = "not_started"
	EventStatusOnGoing    EventStatus = "on_going"

	EventClassificationTT        EventClassifcation = "tt"
	EventClassificationTeamTT    EventClassifcation = "ttt"
	EventClassificationProlgogue EventClassifcation = "prologue"
)

type EventSeries struct {
	ID uuid.UUID `db:"id" json:"id"`
	common.Timestamps
}

type Event struct {
	ID             uuid.UUID   `db:"id" json:"id"`
	Name           string      `db:"name" json:"name"`
	EventSeriesID  *uuid.UUID  `db:"event_series_id" json:"eventSeriesId,omitempty"`
	ParentEventID  *uuid.UUID  `db:"parent_event_id" json:"parentEventId,omitempty"`
	CategoryID     *uuid.UUID  `db:"category_id" json:"categoryId,omitempty"`
	SeasonID       uuid.UUID   `db:"season_id" json:"seasonId"`
	Classification *string     `db:"classification" json:"classification,omitempty"`
	Type           EventType   `db:"type" json:"type"`
	Status         EventStatus `db:"status" json:"status"`
	Start          time.Time   `db:"start" json:"start"`
	End            *time.Time  `db:"end" json:"end,omitempty"`
	DepartureCity  *string     `db:"departure_city" json:"departureCity,omitempty"`
	ArrivalCity    *string     `db:"arrival_city" json:"arrivalCity,omitempty"`
	Distance       *string     `db:"distance" json:"distance,omitempty"`
	DistanceUnit   *string     `db:"distance_unit" json:"distanceUnit,omitempty"`
	IsSingleDay    bool        `db:"is_single_day" json:"isSingleDay"`
	CountryCode    *string     `db:"country_code" json:"countryCode,omitempty"`

	common.Timestamps
}
