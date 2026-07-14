package handler

import (
	"github.com/gin-gonic/gin"
	"github.com/th-herve/cycling-app/backend/internal/app"
	"github.com/th-herve/cycling-app/backend/internal/common"
)

type FeedHandler struct {
	feedService *app.FeedService
}

func NewFeedHandler(feedService *app.FeedService) *FeedHandler {
	return &FeedHandler{feedService: feedService}
}

func (h *FeedHandler) Post(c *gin.Context) {
	var slugs []string
	if err := c.ShouldBindJSON(&slugs); err != nil {
		c.Error(common.ErrInvalidInput)
		return
	}

	token, err := h.feedService.GenerateToken(slugs)
	if err != nil {
		c.Error(common.ErrInternal)
	}

	SuccessResponse(c, token)
}
