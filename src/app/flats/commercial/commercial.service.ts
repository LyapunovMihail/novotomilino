import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IAddressItemFlat } from '../../../../serv-files/serv-modules/addresses-api/addresses.config';

@Injectable()
export class CommercialService {

    constructor( private http: HttpClient ) { }

    public getObjects(options): Observable<IAddressItemFlat[]> {
        return this.http.post<IAddressItemFlat[]>('/api/search', { search: options });
    }

    public getHouse(num): Observable<IAddressItemFlat[]> {
        return this.http.get<IAddressItemFlat[]>('/api/search', { params: { houses: num, type: 'КН' } });
    }

    public parseConfig(flats) {
        return {
            price: {
                min: flats.length > 0 ? Math.min(...flats.map(flat => flat.price)) : 1400000,
                max: flats.length > 0 ? Math.max(...flats.map(flat => flat.price)) : 7000000,
            },
            space: {
                min: flats.length > 0 ? Math.min(...flats.map(flat => flat.space)) : 17,
                max: flats.length > 0 ? Math.max(...flats.map(flat => flat.space)) : 120
            },
            sort: 'floor_1',
            status: [
                {
                    name: 'В продаже',
                    value: '4'
                }, {
                    name: 'Скоро в продаже',
                    value: '1'
                }
            ],
            exitType: [
                {
                    name: 'Выход на улицу',
                    value: '1'
                }, {
                    name: 'Выход во двор',
                    value: '0'
                }
            ],
            housesList: [
                {
                    name: 'Все корпуса',
                    value: 'all'
                }, {
                    name: 'Корпус 1',
                    value: '1',
                    disabled: !flats.some(flat => flat.house === 1),
                }, {
                    name: 'Корпус 2',
                    value: '2',
                    disabled: !flats.some(flat => flat.house === 2),
                }, {
                    name: 'Корпус 3',
                    value: '3',
                    disabled: !flats.some(flat => flat.house === 3),
                }, {
                    name: 'Корпус 9',
                    value: '9',
                    disabled: !flats.some(flat => flat.house === 9),
                }
            ]
        };
    }
}
