package web

import (
	"fmt"
	"log"
	"net/http"
	"strconv"
	"strings"
	"text/template"
)

type PageGroup struct {
	Group  Groupie
	Center [][]float64
}

func Group(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/group" {
		ErrorPage(w, r, http.StatusNotFound)
		return
	}

	id, err := strconv.Atoi(r.URL.Query().Get("id"))
	if err != nil {

		ErrorPage(w, r, http.StatusNotFound)
		return
	}
	if id > len(Groups) || id < 1 {
		ErrorPage(w, r, http.StatusNotFound)
		return
	}

	templ, err := template.ParseFiles("ui/html/groupPage.html", "ui/html/layout.html")
	if err != nil {
		log.Println(err)
		ErrorPage(w, r, http.StatusNotFound)
		return
	}
	temp := PageGroup{}
	temp.Group = Groups[id-1]
	
	for i := 0; i < len(Groups[id-1].Locations.Locations); i++ {
		cityAndCountry:=strings.Split(Groups[id-1].Locations.Locations[i], "-")
		city := strings.ToUpper(cityAndCountry[1])+","+strings.ToUpper(cityAndCountry[0])
		
		temp.Center = append(temp.Center, getGeo(city))
	}

	err = templ.Execute(w, temp)
	if err != nil {
		fmt.Println(err)
		ErrorPage(w, r, http.StatusInternalServerError)
		return
	}
}
