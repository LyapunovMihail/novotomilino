import { IAddressItemFlat } from '../../../../serv-files/serv-modules/addresses-api/addresses.interfaces';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
declare let $: any;

@Injectable()

export class FloorService {

    constructor(private http: HttpClient) {}

    public getObjects(options): Observable<IAddressItemFlat[]> {
        return this.http.post<IAddressItemFlat[]>('/api/search', { search: options });
    }

    public flatsHover(flats: IAddressItemFlat[], callbacks) {
        const mod = ['studio', 'one-room', 'two-room', 'three-room'];
        flats.forEach((item: IAddressItemFlat) => {
            const flat = document.querySelector(`#_${item.flat}`);
            // статус квартиры
            const status = true; // item.status === '4';
            if (flat) {
                $(flat).off('mouseenter');
                $(flat).off('mouseleave');
                $(flat).off('click');
                $(flat).on('mouseenter', () => callbacks.hover(item));
                $(flat).on('mouseleave', () => callbacks.hover(null));
                $(flat).on('click', () => callbacks.click(item));
                $(flat).addClass('flat-mod');
                $(flat).addClass(`flat-mod--${((status) ? mod[Number(item.rooms)] : 'out-of-stock')}`);
            }
        });
    }
}
