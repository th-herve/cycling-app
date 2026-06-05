package identity

import (
	"fmt"
	"strings"
	"time"
	"unicode"

	"github.com/google/uuid"
	"github.com/th-herve/cycling-app/backend/pkg/domain"
	"golang.org/x/text/unicode/norm"
)

var (
	NamespaceRider       = uuid.MustParse("00000000-0000-0000-0000-000000000001")
	NamespaceTeamSeason  = uuid.MustParse("00000000-0000-0000-0000-000000000002")
	NamespaceEvent       = uuid.MustParse("00000000-0000-0000-0000-000000000003")
	NamespaceResult      = uuid.MustParse("00000000-0000-0000-0000-000000000004")
	NamespaceEventSeries = uuid.MustParse("00000000-0000-0000-0000-000000000005")
)

func RiderID(firstName, lastName, nationality string, dob time.Time) uuid.UUID {
	dateStr := formatDateForID(dob)
	data := fmt.Appendf(nil, "%s|%s|%s|%s", firstName, lastName, nationality, dateStr)

	return uuid.NewSHA1(NamespaceRider, data)
}

func TeamSeasonID(abbreviation string, seasonYear int, seasonGender domain.Gender) uuid.UUID {
	data := fmt.Appendf(nil, "%s|%d|%s", abbreviation, seasonYear, seasonGender)
	return uuid.NewSHA1(NamespaceTeamSeason, data)
}

func NewTeamID() uuid.UUID {
	return uuid.New()
}

func NewEventSerieID(name string, gender domain.Gender) uuid.UUID {
	data := fmt.Appendf(nil, "%s|%s", name, gender)
	return uuid.NewSHA1(NamespaceEventSeries, data)
}

// Generate an id for an event of type 'race'
//
// !! Do not use for event of type stage
func EventRaceID(name string, seasonGender domain.Gender, start time.Time) uuid.UUID {
	// TODO have it take the Event directly in the param to check for type == race
	dateStr := formatDateForID(start)
	nameN := normalizeName(name)
	data := fmt.Appendf(nil, "%s|%s|%s", nameN, seasonGender, dateStr)
	return uuid.NewSHA1(NamespaceEvent, data)
}

// Generate an id for an event of type 'stage'
//
// !! Do not use for event of type race
func EventStageID(name string, seasonGender domain.Gender, start time.Time, mainRaceEventID uuid.UUID) uuid.UUID {
	// TODO have it take the Event directly in the param to check for type == stage
	dateStr := formatDateForID(start)
	nameN := normalizeName(name)
	data := fmt.Appendf(nil, "%s|%s|%s|%s", nameN, seasonGender, dateStr, mainRaceEventID.String())
	return uuid.NewSHA1(NamespaceEvent, data)
}

// Generate an id for a result row.
//
// ParticipantID is either a riderID or a teamSeasonID, depending on the result type.
func ResultID(resultType domain.ResultType, eventID uuid.UUID, participantID uuid.UUID) uuid.UUID {
	data := fmt.Appendf(nil, "%s|%s|%s", resultType, eventID.String(), participantID.String())
	return uuid.NewSHA1(NamespaceResult, data)
}

func formatDateForID(date time.Time) string {
	return date.Format("2006-01-02")
}

// remove accent from names
func normalizeName(name string) string {
	// Normalize to NFD form to separate accents
	t := norm.NFD.String(name)
	var b strings.Builder
	for _, r := range t {
		if unicode.Is(unicode.Mn, r) { // skip accents
			continue
		}
		b.WriteRune(unicode.ToLower(r))
	}
	return strings.ToLower(b.String())
}
