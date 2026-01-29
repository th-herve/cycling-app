package handler

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/th-herve/cycling-app/backend/internal/common"
)

type APIResponse struct {
	StatusCode int    `json:"statusCode"`
	Status     string `json:"status"`
	Message    string `json:"message,omitempty"`
	Data       any    `json:"data,omitempty"`  // Data returned on success, omitted if empty
	Error      any    `json:"error,omitempty"` // Specific error info on failure, omitted if empty
}

func SuccessResponse(c *gin.Context, data any) {
	c.JSON(http.StatusOK, APIResponse{
		StatusCode: http.StatusOK,
		Status:     "success",
		Data:       data,
	})
}

func ErrorResponse(c *gin.Context, code int, message string) {
	c.JSON(code, APIResponse{
		StatusCode: code,
		Status:     "error",
		Message:    message,
	})
}

func HandleError(c *gin.Context, err error) {
	switch {
	case errors.Is(err, common.ErrNotFound):
		ErrorResponse(c, http.StatusNotFound, "NOT_FOUND_ERROR")

	case errors.Is(err, common.ErrInvalidInput):
		ErrorResponse(c, http.StatusBadRequest, "INVALID_INPUT_ERROR")

	default:
		ErrorResponse(c, http.StatusInternalServerError, "INTERNAL_ERROR")
	}
}
