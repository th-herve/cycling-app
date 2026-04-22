package app

import "github.com/th-herve/cycling-app/backend/pkg/domain"

// Take a list of entity implementing HasCountryCode and returns a list of the country's id
func collectCountriesCodes(entities []domain.HasCountryCode) []string {
	seen := map[string]bool{}
	result := []string{}

	for _, entity := range entities {
		code := entity.GetCountryCode()
		if code == nil {
			continue
		}

		_, saw := seen[*code]
		if saw {
			continue
		}

		result = append(result, *code)
		seen[*code] = true
	}

	return result
}

