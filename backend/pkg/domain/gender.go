package domain

import "fmt"

type Gender string

const (
	GenderWomen Gender = "women"
	GenderMen   Gender = "men"
)

func ParseGender(s string) (Gender, error) {
	switch s {
	case string(GenderMen):
		return GenderMen, nil
	case string(GenderWomen):
		return GenderWomen, nil
	default:
		return "", fmt.Errorf("invalid gender: %s", s)
	}
}
