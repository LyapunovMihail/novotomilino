import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { IAddressItemFlat } from '../../../../serv-files/serv-modules/addresses-api/addresses.interfaces';

@Injectable ()

export class PlanService {

    public showSearchPanel = new Subject<boolean>();

    constructor( private http: HttpClient ) { }

    public getHouse(houses): Observable<IAddressItemFlat[]> {
        return this.http.get<IAddressItemFlat[]>('/api/search', { params: { houses, status: '1,4', type: 'КВ' } });
    }

    public setShowSearchPanel(val) {
        this.showSearchPanel.next(val);
    }

    public getShowSearchPanel() {
        return this.showSearchPanel.asObservable();
    }
}
