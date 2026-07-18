package app

import (
	"context"
	"fmt"
	"strings"
	"time"

	ics "github.com/arran4/golang-ical"
	"github.com/rs/zerolog/log"
	"github.com/th-herve/cycling-app/backend/internal/app/dto"
	"github.com/th-herve/cycling-app/backend/pkg/domain"
)

type FeedService struct {
	eventService *EventService
}

func NewFeedService(eventService *EventService) *FeedService {
	return &FeedService{
		eventService: eventService,
	}
}

func (s *FeedService) GetFeed(ctx context.Context, gender domain.Gender) (string, error) {
	year := time.Now().Year()
	events, err := s.eventService.FindAllBySeason(ctx, year, gender)
	if err != nil {
		log.Warn().Caller().Err(err).Msg("error finding events")
		return "", err
	}

	cal := ics.NewCalendar()
	cal.SetMethod(ics.MethodPublish)
	cal.SetXWRCalName("Cycling calendar " + string(gender))
	cal.SetCalscale("GREGORIAN")
	cal.SetProductId("-//th-herve.fr//Cycling Calendar//EN") // TODO .env or config var

	for _, e := range events {
		if e.Stages == nil || len(e.Stages) == 0 {
			event := cal.AddEvent(e.ID.String() + "@cycling.th-herve.fr") // TODO .env or config
			s.convertEventToIcal(event, e)
		} else {
			for _, st := range e.Stages {
				event := cal.AddEvent(st.ID.String() + "@cycling.th-herve.fr") // TODO .env or config
				s.convertEventToIcal(event, st)
			}
		}
	}

	// WithNewLineWindows uses CRLF new line, which is better for broad compatibility (see golang-ical library readme).
	return cal.Serialize(ics.WithNewLineWindows), err
}

func (s *FeedService) convertEventToIcal(event *ics.VEvent, e *dto.EventDTO) {
	event.SetCreatedTime(e.CreatedAt)
	event.SetDtStampTime(time.Now().UTC())
	if e.UpdatedAt != nil {
		event.SetModifiedAt(*e.UpdatedAt)
	}

	// Set country.
	if e.Country.Name != "" {
		event.SetLocation(e.Country.Name)
	}

	// Set dates.
	event.SetAllDayStartAt(e.Start)
	end := e.Start
	if e.End != nil {
		end = *e.End
	}
	// iCalendar end date is exclusive, so we need to add 1 day to the actual end date.
	end = end.AddDate(0, 0, 1)
	event.SetAllDayEndAt(end)

	desc := []string{}
	if e.DepartureCity != nil && e.ArrivalCity != nil {
		desc = append(desc, *e.DepartureCity+" - "+*e.ArrivalCity)
	}
	if e.Classification != nil {
		desc = append(desc, *e.Classification)
	}

	// Set link.
	if e.Slug != nil {
		url := fmt.Sprintf("https://cycling.th-herve.fr/events/%s/%d", *e.Slug, e.Start.Year())
		event.SetURL(url)

		desc = append(desc, "More infos: "+url)
	}

	name := e.Name
	if e.Type == domain.EventTypeStage && e.ParentName != nil {
		name = *e.ParentName + " " + e.Name
	}

	event.SetDescription(strings.Join(desc, "\n"))

	event.SetSummary(name)
	event.SetColor("#313160")
}
