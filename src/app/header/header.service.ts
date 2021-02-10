import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface IHeaderLink {
    name: string;
    url: string;
    tooltip?: any[];
}

@Injectable( )

export class HeaderService {

    constructor(
        private http: HttpClient
    ) { }

    public getDynamicLink() {
        return this.http.get('/api/dynamic/last/link');
    }
    public getPhone() {
        return this.http.get('/api/contacts/phone');
    }

    public links(data): IHeaderLink[] {
        let date = new Date();
        let year = (data.year) ? data.year : date.getFullYear();
        let month = (data.month) ? data.month : ( date.getMonth() + 1 );
        return [
            { name: 'О ЖК', url: '/about' },
            { name: 'Расположение', url: `/location/routes` },
            { name: 'Квартиры', url: `/flats/plan`,
                tooltip: [
                    { name: 'Коммерческая недвижимость', url: '/flats/commercial/list' }
                ],
            },
            { name: 'Отделка', url: '/decoration',
                // tooltip: [
                //     { name: 'Квартиры с мебелью', url: '/furniture' }
                // ],
            },
            { name: 'Ход строительства', url: `/dynamic/${year}/${month}` },
            { name: 'Условия покупки', url: '/purchase/credit' },
            { name: 'Новости и акции', url: '/news-shares/all' },
        ];
    }
}
