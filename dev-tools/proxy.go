package main

import (
	"fmt"
	"io"
	"net/http"
	"os"
)

func main() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Println(r.URL.Path)
		p := r.URL.Path[1:]
		if p == "" {
			p = "index.html"
		}
		fi, err := os.Open(p)
		if err == nil {
			defer fi.Close()
			io.Copy(w, fi)
			return
		}

		resp, err := http.Get("http://localhost:8080" + r.URL.Path)
		if err != nil {
			http.Error(w, err.Error(), 404)
			return
		}

		defer resp.Body.Close()
		io.Copy(w, resp.Body)
	})

	panic(http.ListenAndServe(":9117", nil))
}
