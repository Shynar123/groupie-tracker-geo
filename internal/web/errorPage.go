package web

import (
	"fmt"
	"net/http"
	"text/template"
)

func ErrorPage(w http.ResponseWriter, r *http.Request, status int) {
	e := Err{
		StatusCode: status,
		StatusText: http.StatusText(status),
	}

	w.WriteHeader(status)

	tmpl, err := template.ParseFiles("ui/html/errpage.html", "ui/html/layout.html")
	if err != nil {
		http.Error(w, http.StatusText(http.StatusNotFound), http.StatusNotFound)
		return
	}

	err = tmpl.Execute(w, e)

	if err != nil {
		fmt.Println("what error??",err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}
}
