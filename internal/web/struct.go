package web

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
)

type Groupie struct {
	ID           int      `json:"id"`
	Image        string   `json:"image"`
	Name         string   `json:"name"`
	Members      []string `json:"members"`
	CreationDate int      `json:"creationDate"`
	FirstAlbum   string   `json:"firstAlbum"`
	Locations    Location `json:"-"`
	ConcertDates Date     `json:"-"`
	Relations    Relation `json:"-"`
}
type GroupieJs struct {
	ID           int                 `json:"id"`
	Image        string              `json:"image"`
	Name         string              `json:"name"`
	Members      []string            `json:"members"`
	CreationDate int                 `json:"creationDate"`
	FirstAlbum   string              `json:"firstAlbum"`
	Locations    []map[string]string `json:"locations"`
	ConcertDates []string            `json:"concertDates"`
	Relations    map[string][]string `json:"relations"`
}

type Location struct {
	Locations []string `json:"locations"`
}

type Date struct {
	Dates []string `json:"dates"`
}

type Relation struct {
	DatesLocation map[string][]string `json:"datesLocations"`
}

type Err struct {
	StatusCode int
	StatusText string
}

var Groups = make([]Groupie, 0)

func getLocation() {
	type t struct {
		Index []Location `json:"index"`
	}

	temp := t{
		Index: make([]Location, 0),
	}

	url := "https://groupietrackers.herokuapp.com/api/locations"

	idData, err := getData(url)
	if err != nil {
		log.Fatal(err)
		return
	}

	err = json.Unmarshal(idData, &temp)
	if err != nil {
		log.Fatal(err)
		return
	}
	if len(Groups) != len(temp.Index) {
		log.Fatal("error: lengths of locations and groups are different")
		return
	}
	for id := range Groups {
		Groups[id].Locations.Locations = temp.Index[id].Locations
	}
}

func getConcertDates() {
	type t struct {
		Index []Date `json:"index"`
	}

	temp := t{
		Index: make([]Date, 0),
	}

	url := "https://groupietrackers.herokuapp.com/api/dates"

	idData, err := getData(url)
	if err != nil {
		log.Fatal(err)
		return
	}

	err = json.Unmarshal(idData, &temp)
	if err != nil {
		log.Fatal(err)
		return
	}
	if len(Groups) != len(temp.Index) {
		log.Fatal("error: lengths of locations and groups are different")
		return
	}
	for id := range Groups {
		Groups[id].ConcertDates.Dates = temp.Index[id].Dates
	}
}

func getRelations() {
	type t struct {
		Index []Relation `json:"index"`
	}

	temp := t{
		Index: make([]Relation, 0),
	}

	url := "https://groupietrackers.herokuapp.com/api/relation"

	idData, err := getData(url)
	if err != nil {
		log.Fatal(err)
		return
	}
	err = json.Unmarshal(idData, &temp)
	if err != nil {
		log.Fatal(err)
		return
	}
	if len(Groups) != len(temp.Index) {
		log.Fatal("error: lengths of locations and groups are different")
		return
	}
	for id := range Groups {
		Groups[id].Relations.DatesLocation = temp.Index[id].DatesLocation
	}
}

func init() {
	log.SetFlags(log.Lshortfile)
	url := "https://groupietrackers.herokuapp.com/api/artists"

	resp, err := http.Get(url)
	if err != nil {
		log.Fatal(err)
		return
	}

	defer resp.Body.Close()

	jsonData, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Fatal(err)
		return
	}

	err = json.Unmarshal(jsonData, &Groups)
	if err != nil {
		log.Fatal(err)
		return
	}
	getLocation()
	getRelations()
	getConcertDates()
}

func getData(url string) ([]byte, error) {
	resp, err := http.Get(url)
	if err != nil {
		return nil, err
	}

	defer resp.Body.Close()

	idData, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}
	return idData, nil
}
