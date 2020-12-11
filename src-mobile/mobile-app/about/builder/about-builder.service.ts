import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class AboutBuilderService {

    constructor( private http: HttpClient ) { }

    public queryObjects(mod) {
        return this.http.get(`/api/about-projects/${mod}`);
    }
}
