package domain

import (
	"time"

	"github.com/google/uuid"
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
	ID   uuid.UUID `db:"id" json:"id"`
	Name *string   `db:"name" json:"name"`

	Timestamps
}

type Event struct {
	ID             uuid.UUID   `db:"id" json:"id"`
	Name           string      `db:"name" json:"name"`
	EventSeriesID  *uuid.UUID  `db:"event_series_id" json:"eventSeriesId,omitempty"`
	ParentEventID  *uuid.UUID  `db:"parent_event_id" json:"parentEventId,omitempty"`
	CategoryCode   *string     `db:"category_code" json:"categoryCode,omitempty"`
	SeasonYear     int         `db:"season_year" json:"seasonYear"`
	SeasonGender   Gender      `db:"season_gender" json:"seasonGender"`
	Classification *string     `db:"classification" json:"classification,omitempty"`
	Type           EventType   `db:"type" json:"type"`
	Status         EventStatus `db:"status" json:"status"`
	Start          time.Time   `db:"start" json:"start"`
	End            *time.Time  `db:"end" json:"end,omitempty"`
	DepartureCity  *string     `db:"departure_city" json:"departureCity,omitempty"`
	ArrivalCity    *string     `db:"arrival_city" json:"arrivalCity,omitempty"`
	Distance       *float64    `db:"distance" json:"distance,omitempty"`
	DistanceUnit   *string     `db:"distance_unit" json:"distanceUnit,omitempty"`
	IsSingleDay    bool        `db:"is_single_day" json:"isSingleDay"`
	CountryCode    *string     `db:"country_code" json:"countryCode,omitempty"`
	Slug           *string     `db:"slug" json:"slug"`

	Timestamps
}

func (e *Event) GetCountryCode() *string {
	return e.CountryCode
}
