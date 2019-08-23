import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IAddressItemFlat } from '../../../../serv-files/serv-modules/addresses-api/addresses.interfaces';

@Injectable()

export class HouseService {

    constructor(private http: HttpClient) { }

    public sectionMarkers() {
        return ([
            {
                section: '1',
                house: '1'
            }, {
                section: '2',
                house: '1'
            }, {
                section: '3',
                house: '1'
            }, {
                section: '4',
                house: '2'
            }, {
                section: '5',
                house: '2'
            }, {
                section: '6',
                house: '2'
            }
        ]);
    }

    public getObjects(options): Observable<IAddressItemFlat[]> {
        return this.http.post<IAddressItemFlat[]>('/api/search', { search: options });
    }

    public createFreeFlats(flats: IAddressItemFlat[]): any {
        return flats.reduce((res: object, fl: IAddressItemFlat) => {
            res[fl['section']] = res[fl['section']] ?
                res[fl['section']] :
                {};
            res[fl['section']][fl.floor] = res[fl['section']][fl.floor] ?
                res[fl['section']][fl.floor] :
                {};
            res[fl['section']][fl.floor][fl.rooms] = res[fl['section']][fl.floor][fl.rooms] ?
                (fl.status === '4' ?
                    res[fl['section']][fl.floor][fl.rooms] + 1 :
                    res[fl['section']][fl.floor][fl.rooms]
                ) :
                (fl.status === '4' ?
                    1 :
                    0
                );
            return res;
        }, {});
    }
}
