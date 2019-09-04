import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IAddressItemFlat } from '../../../../serv-files/serv-modules/addresses-api/addresses.config';
import { IFlatResponse } from '../../../../serv-files/serv-modules/addresses-api/addresses.interfaces';

@Injectable()

export class SearchService {

    constructor(private http: HttpClient) {}

    public getObjects(options): Observable<IFlatResponse> {
        return this.http.post<IFlatResponse>('/api/search/with_count', { search: options });
    }

    public getConfig() {
        return this.http.get('/api/search-config');
    }
}
