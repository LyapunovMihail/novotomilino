import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IAddressItemFlat } from '../../../../serv-files/serv-modules/addresses-api/addresses.interfaces';

@Injectable ()

export class PlanService {

    constructor( private http: HttpClient ) { }

    public getHouse(num): Observable<IAddressItemFlat[]> {
        return this.http.get<IAddressItemFlat[]>('/api/search', { params: {houses: num} });
    }
}
