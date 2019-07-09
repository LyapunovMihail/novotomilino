import { adminHeaders } from './../commons/admin-headers.utilit';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()

export class DynamicService {

    constructor( private http: HttpClient ) {}

    public getObjects(): Observable<any> {
        return this.http.get('/api/dynamic').pipe(map((response: Response) => response.json()));
    }

}
