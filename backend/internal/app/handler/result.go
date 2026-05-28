package handler

import (
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/th-herve/cycling-app/backend/internal/app"
	"github.com/th-herve/cycling-app/backend/internal/common"
)

type ResultHandler struct {
	resultService *app.ResultService
}

func NewResultHandler(resultService *app.ResultService) *ResultHandler {
	return &ResultHandler{resultService: resultService}
}

func (h *ResultHandler) GetOneByEventID(c *gin.Context) {
	idParam := c.Param("eventID")

	id, err := uuid.Parse(idParam)

	if err != nil {
		c.Error(common.ErrInvalidInput)
		return
	}

	result, err := h.resultService.FindByEventID(c.Request.Context(), id, nil)

	if err != nil {
		c.Error(err)
		return
	}

	SuccessResponse(c, result)
}
