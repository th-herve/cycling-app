package identity

import (
	"fmt"
	"strconv"
	"strings"
	"time"
	"unicode"

	"github.com/google/uuid"
	"golang.org/x/text/unicode/norm"
)

var (
	NamespaceDiscipline   = uuid.MustParse("00000000-0000-0000-0000-000000000001")
	NamespaceCategory     = uuid.MustParse("00000000-0000-0000-0000-000000000002")
	NamespaceTeamCategory = uuid.MustParse("00000000-0000-0000-0000-000000000003")
	NamespaceRider        = uuid.MustParse("00000000-0000-0000-0000-000000000004")
	NamespaceSeason       = uuid.MustParse("00000000-0000-0000-0000-000000000005")
	NamespaceTeamSeason   = uuid.MustParse("00000000-0000-0000-0000-000000000006")
	NamespaceEvent        = uuid.MustParse("00000000-0000-0000-0000-000000000007")
	NamespaceResult       = uuid.MustParse("00000000-0000-0000-0000-000000000008")
)

func DisciplineID(code string) uuid.UUID {
	return uuid.NewSHA1(NamespaceDiscipline, []byte(code))
}

func CategoryID(code string) uuid.UUID {
	return uuid.NewSHA1(NamespaceCategory, []byte(code))
}

func TeamCategoryID(code string) uuid.UUID {
	return uuid.NewSHA1(NamespaceTeamCategory, []byte(code))
}

func RiderID(firstName, lastName, nationality string, dob time.Time) uuid.UUID {
	dateStr := formatDateForID(dob)
	data := fmt.Appendf(nil, "%s|%s|%s|%s", firstName, lastName, nationality, dateStr)

	return uuid.NewSHA1(NamespaceRider, data)
}

func SeasonID(year int, gender string) uuid.UUID {
	return uuid.NewSHA1(NamespaceSeason, []byte(strconv.Itoa(year)+"|"+gender))
}

func TeamSeasonID(abbreviation, categoryCode string, seasonYear int) uuid.UUID {
	data := fmt.Appendf(nil, "%s|%s|%d", abbreviation, categoryCode, seasonYear)
	return uuid.NewSHA1(NamespaceTeamSeason, data)
}

// Generate an id for an event of type 'race'
//
// !! Do not use for event of type stage
func EventRaceID(name string, seasonID uuid.UUID, start time.Time) uuid.UUID {
	// TODO have it take the Event directly in the param to check for type == race
	dateStr := formatDateForID(start)
	nameN := normalizeName(name)
	data := fmt.Appendf(nil, "%s|%s|%s", nameN, seasonID.String(), dateStr)
	return uuid.NewSHA1(NamespaceEvent, data)
}

// Generate an id for an event of type 'stage'
//
// !! Do not use for event of type race
func EventStageID(name string, seasonID uuid.UUID, start time.Time, mainRaceEventID uuid.UUID) uuid.UUID {
	// TODO have it take the Event directly in the param to check for type == stage
	dateStr := formatDateForID(start)
	nameN := normalizeName(name)
	data := fmt.Appendf(nil, "%s|%s|%s|%s", nameN, seasonID.String(), dateStr, mainRaceEventID.String())
	return uuid.NewSHA1(NamespaceEvent, data)
}

func ResultID(resultType string, eventId uuid.UUID, rank int) uuid.UUID {
	data := fmt.Appendf(nil, "%s|%s|%d", resultType, eventId.String(), rank)
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
