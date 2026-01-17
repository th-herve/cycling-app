package handler

import (
	"cycling-backend/internal/app"
	"cycling-backend/internal/common"
	"strconv"

	"github.com/gin-gonic/gin"
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

	gender, err := common.ParseGender(genderQuery)

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
