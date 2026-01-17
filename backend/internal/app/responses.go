package app

import (
	"cycling-backend/internal/common"
	"cycling-backend/internal/domain/event"
)

type EventResponse struct {
	event.Event
	Country    *common.CountrySnapshot `json:"country,omitempty"`
	Stages     []*EventResponse        `json:"stages,omitempty"`
	ParentName *string                 `json:"parentName,omitempty"`
}
