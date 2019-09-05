import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IAddressItemFlat } from '../../../../serv-files/serv-modules/addresses-api/addresses.config';

@Injectable()

export class SearchService {

    constructor(private http: HttpClient) {}

    public getObjects(options): Observable<IAddressItemFlat[]> {
        return this.http.post<IAddressItemFlat[]>('/api/search', { search: options });
    }

    public getConfig() {
        return this.http.get('/api/search-config');
    }
}
