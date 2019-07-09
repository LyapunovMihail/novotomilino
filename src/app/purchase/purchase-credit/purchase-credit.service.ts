import { adminHeaders } from './../../commons/admin-headers.utilit';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ICreditSnippet } from '../../../../serv-files/serv-modules/credit-api/credit.interfaces';
import { Observable } from 'rxjs';

@Injectable()

export class PurchaseCreditService {

    constructor( private http: HttpClient ) { }

    public getSnippet(): Observable<ICreditSnippet[]> {
        return this.http.get<ICreditSnippet[]>('/api/credit')
    }

    public setSnippet(): Observable<ICreditSnippet[]> {
        const message = JSON.stringify({ });
        return this.http.post<ICreditSnippet[]>('/api/admin/credit/create', message, adminHeaders())
    }

    public deleteSnippet(id): Observable<ICreditSnippet[]> {
        const message = JSON.stringify({ id });
        return this.http.post<ICreditSnippet[]>('/api/admin/credit/delete', message, adminHeaders())
    }

    public updateSnippet( id, key, value ): Observable<ICreditSnippet[]> {
        const message = JSON.stringify({ id, key, value });
        return this.http.post<ICreditSnippet[]>('/api/admin/credit/update', message, adminHeaders())
    }

}
