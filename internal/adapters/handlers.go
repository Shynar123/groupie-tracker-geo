package handler

import (
	"log"
	"net/http"
	"time"
	pages "groupie-tracker/internal/web"
)

func Handler() {
	mux := http.NewServeMux()

	mux.HandleFunc("/", pages.MainPage)
	mux.HandleFunc("/group", pages.Group)

	mux.Handle("/static/", http.StripPrefix("/static", http.FileServer(http.Dir("./ui/static/"))))

	server := &http.Server{
		Addr:         ":8080",
		Handler:      mux,
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 5 * time.Second,
		ErrorLog:     log.Default(),
	}
	log.Println("the server is running on http://localhost" + server.Addr)
	if err := server.ListenAndServe(); err != nil {
		log.Fatalln(err)
	}
}
