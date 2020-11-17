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
        return this.http.get<IAddressItemFlat[]>('/api/search', { params: { houses: num, articleType: '16' } });
    }

    public parseConfig(flats) {
        return {
            price: {
                min: Math.min(...flats.map(flat => flat.price)),
                max: Math.max(...flats.map(flat => flat.price)),
            },
            space: {
                min: Math.min(...flats.map(flat => flat.space)),
                max: Math.max(...flats.map(flat => flat.space))
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
                    name: '1',
                    value: '1',
                    disabled: !flats.some(flat => flat.house === 1),
                }, {
                    name: '2',
                    value: '2',
                    disabled: !flats.some(flat => flat.house === 2),
                }, {
                    name: '3',
                    value: '3',
                    disabled: !flats.some(flat => flat.house === 3),
                }, {
                    name: '4',
                    value: '4',
                    disabled: !flats.some(flat => flat.house === 4),
                }, {
                    name: '5',
                    value: '5',
                    disabled: !flats.some(flat => flat.house === 5),
                }, {
                    name: '6',
                    value: '6',
                    disabled: !flats.some(flat => flat.house === 6),
                }, {
                    name: '7',
                    value: '7',
                    disabled: !flats.some(flat => flat.house === 7),
                }, {
                    name: '8',
                    value: '8',
                    disabled: !flats.some(flat => flat.house === 8),
                }
            ]
        };
    }
}
