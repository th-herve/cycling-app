package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/th-herve/cycling-app/backend/internal/app"
	"github.com/th-herve/cycling-app/backend/internal/common"
	"github.com/th-herve/cycling-app/backend/pkg/domain"
)

type FeedHandler struct {
	feedService *app.FeedService
}

func NewFeedHandler(feedService *app.FeedService) *FeedHandler {
	return &FeedHandler{feedService: feedService}
}

func (h *FeedHandler) GetMen(c *gin.Context) {
	feed, err := h.feedService.GetFeed(c.Request.Context(), domain.GenderMen)
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

func (h *FeedHandler) GetWomen(c *gin.Context) {
	feed, err := h.feedService.GetFeed(c.Request.Context(), domain.GenderWomen)
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
