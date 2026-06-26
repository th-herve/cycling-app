package storage

import (
	"context"

	"github.com/Masterminds/squirrel"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"github.com/th-herve/cycling-app/backend/internal/common/db"
	"github.com/th-herve/cycling-app/backend/pkg/domain"
)

type TeamStorage struct {
	db *sqlx.DB
}

func NewTeamStorage(db *sqlx.DB) *TeamStorage {
	return &TeamStorage{db: db}
}

func (s *TeamStorage) FindByID(ctx context.Context, teamID uuid.UUID) (domain.TeamSeason, error) {
	query, args, err := db.Q.Select("*").From("team_seasons").Where(squirrel.Eq{"id": teamID.String()}).ToSql()

	if err != nil {
		return domain.TeamSeason{}, err
	}

	var team domain.TeamSeason

	err = s.db.QueryRow(query, args...).Scan(team)

	if err != nil {
		return domain.TeamSeason{}, err
	}

	return team, nil
}

func (s *TeamStorage) FindManyIDs(ctx context.Context, teamsID []uuid.UUID) ([]*domain.TeamSeason, error) {
	query, args, err := db.Q.Select("*").From("team_seasons").Where(squirrel.Eq{"id": teamsID}).ToSql()

	if err != nil {
		return nil, err
	}

	var teams []*domain.TeamSeason

	err = s.db.Select(&teams, query, args...)

	if err != nil {
		return nil, err
	}

	return teams, nil
}

func (s *TeamStorage) FindManyByRiderIDsAndSeason(ctx context.Context, riderIDs []uuid.UUID, seasonYear int) (map[uuid.UUID]*domain.TeamSeason, error) {

	queryBuilder := db.Q.Select("team_seasons.*, team_rosters.rider_id").
		From("team_seasons").
		Join("team_rosters ON team_rosters.team_season_id = team_seasons.id").
		Where(squirrel.Eq{"team_rosters.rider_id": riderIDs, "team_seasons.season_year": seasonYear})

	query, args, err := queryBuilder.ToSql()

	if err != nil {
		return nil, err
	}

	var rows []struct {
		domain.TeamSeason
		RiderID uuid.UUID `db:"rider_id"`
	}

	err = s.db.Select(&rows, query, args...)

	if err != nil {
		return nil, err
	}

	teamsByRiderID := make(map[uuid.UUID]*domain.TeamSeason, len(rows))

	for i := range rows {
		teamsByRiderID[rows[i].RiderID] = &rows[i].TeamSeason
	}

	return teamsByRiderID, nil
}

func (s *TeamStorage) FindBySeasonAndGender(ctx context.Context, gender domain.Gender, year int) ([]*domain.TeamSeason, error) {

	query, args, err := db.Q.Select("*").From("team_seasons").Where(squirrel.Eq{"season_gender": gender, "season_year": year}).OrderBy("team_category_code", "name").ToSql()

	if err != nil {
		return nil, err
	}

	var teams []*domain.TeamSeason

	err = s.db.Select(&teams, query, args...)

	if err != nil {
		return nil, err
	}

	return teams, nil
}
