import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IAddressItemFlat } from '../../../../serv-files/serv-modules/addresses-api/addresses.interfaces';

@Injectable()

export class HouseService {

    constructor(private http: HttpClient) { }

    public getObjects(options): Observable<IAddressItemFlat[]> {
        return this.http.post<IAddressItemFlat[]>('/api/search', { search: options });
    }
    public getHousesChess(): Observable<any> {
        return this.http.get<any>(`/api/get_house_chess`);
    }
}
