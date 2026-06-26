package handler

import (
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/th-herve/cycling-app/backend/internal/app"
	"github.com/th-herve/cycling-app/backend/internal/common"
	"github.com/th-herve/cycling-app/backend/pkg/domain"
)

type TeamHandler struct {
	teamService *app.TeamService
}

func NewTeamHandler(teamService *app.TeamService) *TeamHandler {
	return &TeamHandler{
		teamService: teamService,
	}
}

func (h *TeamHandler) GetBySeasonAndGender(c *gin.Context) {
	yearQuery, ok := c.GetQuery("year")

	if !ok {
		c.Error(common.ErrInvalidInput)
		return
	}

	genderQuery, ok := c.GetQuery("gender")

	if !ok {
		c.Error(common.ErrInvalidInput)
		return
	}

	gender, err := domain.ParseGender(genderQuery)

	if err != nil {
		c.Error(common.ErrInvalidInput)
		return
	}

	year, err := strconv.Atoi(yearQuery)
	if err != nil {
		c.Error(common.ErrInvalidInput)
		return
	}

	teamsSeason, err := h.teamService.FindBySeasonAndGender(c.Request.Context(), gender, year)

	if err != nil {
		c.Error(err)
		return
	}

	SuccessResponse(c, teamsSeason)
}
