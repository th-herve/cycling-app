package handler

import (
	"net/http"
	"strings"

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

func (h *FeedHandler) Get(c *gin.Context) {
	raw := c.Param("token")
	token, ok := strings.CutSuffix(raw, ".ics")
	if !ok {
		c.Error(common.ErrInvalidInput)
		return
	}

	feed, err := h.feedService.GetFeed(c.Request.Context(), token)
	if err != nil {
		c.Error(common.ErrInternal)
		return
	}

	c.Data(
		http.StatusOK,
		"text/calendar; charset=utf-8",
		[]byte(feed),
	)
}
