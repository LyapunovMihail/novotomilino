import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PLAN_SVG } from './plan-svg';
import { IAddressItemFlat } from '../../../../serv-files/serv-modules/addresses-api/addresses.interfaces';

@Injectable ()

export class PlanService {

    constructor ( private http: HttpClient ) { }

    links(): string[] {
        return PLAN_SVG.map((item) => item.houseNumber);
    }

    public getHouseOne(): Observable<IAddressItemFlat[]> {
        return this.http.get<IAddressItemFlat[]>('/api/search', { params: {sections: '1,2,3'} });
    }

    public getHouseTwo(): Observable<IAddressItemFlat[]> {
        return this.http.get<IAddressItemFlat[]>('/api/search', { params: {sections: '4,5,6'} });
    }
}
