import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IFlatResponse, IAddressItemFlat } from '../../../serv-files/serv-modules/addresses-api/addresses.interfaces';
import { BehaviorSubject, Observable } from 'rxjs';
import { TagInterface } from '../../../serv-files/serv-modules/seo-api/seo.interfaces';

@Injectable()

export class FlatsService {

    constructor( private http: HttpClient ) {}

    public getObjects(options): Observable<IFlatResponse> {
        return this.http.post<IFlatResponse>('/api/search/with_count', { search: options });
    }

    public getMetaTags(): Observable<TagInterface[]> {
        return this.http.get<TagInterface[]>('/api/meta_get_flats-search-tag');
    }
    public getFlats(options): Observable<IAddressItemFlat[]> {
        return this.http.post<IAddressItemFlat[]>('/api/search', { search: options });
    }
    public getFlatData(route) {
        return this.http.get('/api' + route);
    }
}
