import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-apartment-pdf',
    template: ``
})

export class ApartmentPdfComponent implements OnInit {

    constructor(
        private http: HttpClient,
        public router: ActivatedRoute,
    ) { }

    ngOnInit() {
        this.getPDF(this.router.queryParams['value'].id).subscribe(
            data => console.log(data)
        );
    }


    public getPDF(id) {
        return this.http.get(`/api/pdf/${id}`);
    }
}
