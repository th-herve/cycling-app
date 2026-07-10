package handler

import (
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/th-herve/cycling-app/backend/internal/app"
	"github.com/th-herve/cycling-app/backend/internal/common"
	"github.com/th-herve/cycling-app/backend/pkg/domain"
)

type EventHandler struct {
	eventService *app.EventService
}

func NewEventHandler(eventService *app.EventService) *EventHandler {
	return &EventHandler{eventService: eventService}
}

func (sc *EventHandler) Get(c *gin.Context) {
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

	events, err := sc.eventService.FindAllBySeason(c.Request.Context(), year, gender)

	if err != nil {
		c.Error(err)
		return
	}

	SuccessResponse(c, events)
}

func (h *EventHandler) GetOne(c *gin.Context) {
	idParam := c.Param("id")

	id, err := uuid.Parse(idParam)

	if err != nil {
		c.Error(common.ErrInvalidInput)
		return
	}

	event, err := h.eventService.FindByID(c.Request.Context(), id)

	if err != nil {
		c.Error(err)
		return
	}

	SuccessResponse(c, event)
}

func (h *EventHandler) GetSlug(c *gin.Context) {
	slug := c.Param("id")

	yearParam := c.Param("year")
	year, err := strconv.Atoi(yearParam)
	if err != nil {
		c.Error(common.ErrInvalidInput)
		return
	}

	event, err := h.eventService.FindBySlug(c.Request.Context(), slug, year)

	if err != nil {
		c.Error(err)
		return
	}

	SuccessResponse(c, event)
}

func (h *EventHandler) GetStages(c *gin.Context) {
	slug := c.Param("id")

	yearParam := c.Param("year")
	year, err := strconv.Atoi(yearParam)
	if err != nil {
		c.Error(common.ErrInvalidInput)
		return
	}

	event, err := h.eventService.FindStages(c.Request.Context(), slug, year)

	if err != nil {
		c.Error(err)
		return
	}

	SuccessResponse(c, event)
}
