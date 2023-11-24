package web

import (
	"encoding/json"
	"fmt"
	"net/http"
	"sort"
	"strconv"
	"strings"
	"text/template"
	"time"
)

type PageInfo struct {
	GroupsJs          []GroupieJs
	Js                string
	CreationDate      string
	StartEndAlbumDate string
	LocationObject	map[string][]string
	LocationJson 				string
}
type ByDate []time.Time

func MainPage(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" {
		ErrorPage(w, r, http.StatusNotFound)
		return
	}

	templ, err := template.ParseFiles("ui/html/index.html", "ui/html/layout.html")
	if err != nil {
		ErrorPage(w, r, http.StatusNotFound)
		return
	}

	temp := PageInfo{
		GroupsJs: make([]GroupieJs, len(Groups)),
	}

	CreationDate := []int{}
	FirstAlbumDate := []time.Time{}
	dateFormat := "02-01-2006"
	for i := range Groups {
		temp.GroupsJs[i].ID = Groups[i].ID
		temp.GroupsJs[i].Image = Groups[i].Image
		temp.GroupsJs[i].Name = Groups[i].Name
		temp.GroupsJs[i].Members = Groups[i].Members
		temp.GroupsJs[i].CreationDate = Groups[i].CreationDate
		CreationDate = append(CreationDate, (temp.GroupsJs[i].CreationDate))
		temp.GroupsJs[i].FirstAlbum = Groups[i].FirstAlbum
		time, err := time.Parse(dateFormat, Groups[i].FirstAlbum)
		if err != nil {
			fmt.Println(err)
		}
		FirstAlbumDate = append(FirstAlbumDate, time)
		for _, location := range Groups[i].Locations.Locations {
			location = strings.ReplaceAll(location, "_", " ")
			m := make(map[string]string)
			cityCountry := strings.Split(location, "-")
			m[cityCountry[1]] = cityCountry[0]
			temp.GroupsJs[i].Locations = append(temp.GroupsJs[i].Locations, m)
		}

		temp.GroupsJs[i].ConcertDates = Groups[i].ConcertDates.Dates
		temp.GroupsJs[i].Relations = Groups[i].Relations.DatesLocation
	}
	temp.LocationObject, temp.LocationJson = LocationObject(Groups)

	sort.Sort(ByDate(FirstAlbumDate))
	albumStartDate := fmt.Sprintf("%d-%d-%d", FirstAlbumDate[0].Year(), FirstAlbumDate[0].Month(), FirstAlbumDate[0].Day())
	albumFinishDate := fmt.Sprintf("%d-%d-%d", FirstAlbumDate[len(FirstAlbumDate)-1].Year(), FirstAlbumDate[len(FirstAlbumDate)-1].Month(), FirstAlbumDate[len(FirstAlbumDate)-1].Day())
	temp.StartEndAlbumDate = albumStartDate + " " + albumFinishDate

	sort.Ints(CreationDate)
	strCreationDate := strconv.Itoa(CreationDate[0]) + " " + strconv.Itoa(CreationDate[len(CreationDate)-1])

	js, err := json.Marshal(&temp.GroupsJs)
	if err != nil {
		ErrorPage(w, r, http.StatusInternalServerError)
	}

	temp.Js = string(js)
	temp.CreationDate = strCreationDate

	err = templ.Execute(w, temp)
	if err != nil {
		fmt.Printf("err: %v\n", err)
		ErrorPage(w, r, http.StatusInternalServerError)
		return
	}
}

func (a ByDate) Len() int           { return len(a) }
func (a ByDate) Swap(i, j int)      { a[i], a[j] = a[j], a[i] }
func (a ByDate) Less(i, j int) bool { return a[i].Before(a[j]) }
