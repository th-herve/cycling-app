package app

import (
	"context"
	"time"

	ics "github.com/arran4/golang-ical"
	"github.com/rs/zerolog/log"
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
	events, err := s.eventService.FindAllBySeason(ctx, 2026, gender)
	if err != nil {
		log.Warn().Caller().Err(err).Msg("error finding events")
		return "", err
	}

	cal := ics.NewCalendar()
	cal.SetMethod(ics.MethodPublish)
	cal.SetName("Cycling calendar " + string(gender))

	for _, e := range events {
		event := cal.AddEvent(e.ID.String())
		event.SetCreatedTime(time.Now())
		event.SetDtStampTime(time.Now())
		event.SetModifiedAt(time.Now())
		event.SetAllDayStartAt(e.Start)
		if e.End != nil {
			// The end on ical is exclusive, so we need to add one day to the actual end date.
			end := time.Date(
				e.End.Year(),
				e.End.Month(),
				e.End.Day()+1,
				0, 0, 0, 0,
				e.End.Location(),
			)
			event.SetAllDayEndAt(end)
		}
		if e.Slug != nil {
			event.SetURL("https://cycling.th-herve.fr/events/" + *e.Slug + "/2026")
		}
		event.SetDescription("More infos: https://cycling.th-herve.fr/events/" + *e.Slug + "/2026")
		event.SetSummary(e.Name)
		event.SetColor("#313160")
	}

	return cal.Serialize(), err
}
