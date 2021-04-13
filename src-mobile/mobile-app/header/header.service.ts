import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IDecorationFurniturePreview } from '../../../serv-files/serv-modules/decoration-api/decoration.interfaces';

export interface IHeaderLink {
    name: string;
    url: string;
}

@Injectable()

export class HeaderService {

    public linksData: any = {};

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
    public getDecorationFurnitureLink(): Observable<IDecorationFurniturePreview[]> {
        return this.http.get<IDecorationFurniturePreview[]>('/api/decoration/preview/get');
    }

    public links() {
        return [
            { name: 'О ЖК', url: '/about' },
            { name: 'Офис продаж', url: `/location/office` },
            { name: 'Расположение', url: `/location/routes` },
            { name: 'Инфраструктура', url: `/location/infrastructure` },
            { name: 'Квартиры', url: `/flats/search` },
            { name: 'Коммерческая недвижимость', url: `/flats/commercial/list` },
            { name: 'Отделка', url: '/decoration' },
            { name: 'Квартиры с мебелью', url: this.linksData.furniture.link }, // type/:type/variant/:variant/room/:room
            { name: 'Ход строительства', url: `/dynamic/${this.linksData.dynamic.year}/${this.linksData.dynamic.month}` },
            { name: 'Условия покупки', url: '/purchase/credit' },

            { name: 'Новости и акции', url: '/news-shares/all' },
            // { name: 'Документация', url: '/documentation' }
        ];
    }
}
