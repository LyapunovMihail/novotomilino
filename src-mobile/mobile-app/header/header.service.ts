import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface IHeaderLink {
    name: string;
    url: string;
}

@Injectable()

export class HeaderService {

    constructor(
        private http: HttpClient
    ) { }

    public writeSessionForFullVersion() {
        return this.http.get('/api/agent/desktop');
    }

    public getDynamicLink() {
        return this.http.get('/api/dynamic/last/link');
    }
    public getPhone() {
        return this.http.get('/api/contacts/phone');
    }

    public links(data) {
        let date = new Date();
        let year = (data.year) ? data.year : date.getFullYear();
        let month = (data.month) ? data.month : ( date.getMonth() + 1 );
        return [
            { name: 'О ЖК', url: '/about' },
            { name: 'Офис продаж', url: `/location/office` },
            { name: 'Расположение', url: `/location/routes` },
            { name: 'Инфраструктура', url: `/location/infrastructure` },
            { name: 'Квартиры', url: `/flats/search` },
            { name: 'Коммерческая недвижимость', url: `/flats/commercial/list` },
            { name: 'Отделка', url: '/decoration' },
            { name: 'Квартиры с мебелью', url: '/decoration/furniture/type/Классика/vendor/Шатура/room/0' }, // type/:type/variant/:variant/room/:room
            { name: 'Ход строительства', url: `/dynamic/${year}/${month}` },
            { name: 'Условия покупки', url: '/purchase/credit' },

            { name: 'Новости и акции', url: '/news-shares/all' },
            // { name: 'Документация', url: '/documentation' }
        ];
    }
}
