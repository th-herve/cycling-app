package domain

type Country struct {
	Alpha3      string `db:"alpha_3_code" json:"alpha3"`
	Alpha2      string `db:"alpha_2_code" json:"alpha2"`
	Name        string `db:"name" json:"name"`
	IocCode     string `db:"ioc_code"`
	NumericCode string `db:"numeric_code"`
	Region      string `db:"region"` // Europe, NA...

	Timestamps
}

type CountryMap map[string]*Country
