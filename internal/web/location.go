package web

import (
	"encoding/json"
	"strings"
	
)

func LocationObject(Groups []Groupie) (map[string][]string, string) {
	m := make(map[string][]string)
	for i := range Groups {
		for _, location := range Groups[i].Locations.Locations {
			location = strings.ToUpper(strings.ReplaceAll(location, "_", " "))

			cityCountry := strings.Split(location, "-")
			m[cityCountry[1]] = append(m[cityCountry[1]], cityCountry[0])

		}
	}

	for country, cities := range m {
		m[country] = removeDuplicateValues(cities)
	}

	countryTest, _ := json.Marshal(m)



	return m, string(countryTest)
}

func removeDuplicateValues(intSlice []string) []string {
	keys := make(map[string]bool)
	list := []string{}

	// If the key(values of the slice) is not equal
	// to the already present value in new slice (list)
	// then we append it. else we jump on another element.
	for _, entry := range intSlice {
		if _, value := keys[entry]; !value {
			keys[entry] = true
			list = append(list, entry)
		}
	}
	return list
}
