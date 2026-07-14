package app

import (
	"context"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"encoding/json"
	"errors"
	"strings"
	"time"

	ics "github.com/arran4/golang-ical"
	"github.com/rs/zerolog/log"
)

var secretKey = []byte("123") // TODO .env file and generate

type FeedService struct {
	eventService *EventService
}

func NewFeedService(eventService *EventService) *FeedService {
	return &FeedService{
		eventService: eventService,
	}
}

func (s *FeedService) GenerateToken(slugs []string) (string, error) {
	payload, err := json.Marshal(slugs)
	if err != nil {
		return "", err
	}
	payloadB64 := base64.RawURLEncoding.EncodeToString(payload)

	mac := hmac.New(sha256.New, secretKey)
	mac.Write([]byte(payloadB64))
	sig := base64.RawURLEncoding.EncodeToString(mac.Sum(nil))

	return payloadB64 + "." + sig, nil
}

func (s *FeedService) GetFeed(ctx context.Context, token string) (string, error) {
	slugs, err := s.decodeToken(token)

	cal := ics.NewCalendar()
	cal.SetMethod(ics.MethodPublish)
	cal.SetName("Cycling calendar")

	for _, slug := range slugs {
		e, err := s.eventService.FindBySlug(ctx, slug, 2026) // TODO hanlde year
		if err != nil {
			log.Warn().Caller().Err(err).Msg("error finding slug")
			continue
		}

		event := cal.AddEvent(e.ID.String())
		event.SetCreatedTime(time.Now())
		event.SetDtStampTime(time.Now())
		event.SetModifiedAt(time.Now())
		event.SetAllDayStartAt(e.Start)
		if e.End != nil {
			event.SetAllDayEndAt(*e.End)
		}
		if e.Slug != nil {
			event.SetURL("https://cycling.th-herve.fr/events/" + *e.Slug + "/2026")
		}
		event.SetSummary(e.Name)
	}

	return cal.Serialize(), err
}

func (s *FeedService) decodeToken(token string) ([]string, error) {
	var slugs []string

	parts := strings.SplitN(token, ".", 2)
	if len(parts) != 2 {
		return slugs, errors.New("malformed token")
	}
	payloadB64, sig := parts[0], parts[1]

	mac := hmac.New(sha256.New, secretKey)
	mac.Write([]byte(payloadB64))
	expected := base64.RawURLEncoding.EncodeToString(mac.Sum(nil))
	if !hmac.Equal([]byte(sig), []byte(expected)) {
		return slugs, errors.New("invalid signature")
	}

	payload, err := base64.RawURLEncoding.DecodeString(payloadB64)
	if err != nil {
		return slugs, err
	}

	err = json.Unmarshal(payload, &slugs)
	return slugs, err
}
