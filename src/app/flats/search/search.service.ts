import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { IAddressItemFlat } from '../../../../serv-files/serv-modules/addresses-api/addresses.config';
import { TagInterface } from '../../../../serv-files/serv-modules/seo-api/seo.interfaces';
import { adminHeaders } from '../../commons/admin-headers.utilit';

@Injectable()

export class SearchService {


    private filter: Subject<any> = new Subject();
    private seoModalShow: Subject<any> = new Subject();
    public outputFlatsChanged: Subject<IAddressItemFlat[]> = new Subject();

    constructor(private http: HttpClient) {}

    public getObjects(options): Observable<IAddressItemFlat[]> {
        return this.http.post<IAddressItemFlat[]>('/api/search', { search: options });
    }

    public getConfig() {
        return this.http.get('/api/search-config');
    }
    public getFlatData(route) {
        return this.http.get('/api' + route);
    }

    public getPDF(id, mod) {
        return this.http.get(`/api/pdf/${id}/${mod}`);
    }

    public getOutputFlatsChanged() {
        return this.outputFlatsChanged;
    }

    public setOutputFlatsChanged(flats) {
        this.outputFlatsChanged.next(flats);
    }

    public sortFlats(sort, searchFlats) {
        const name = sort.split('_')[0];
        const value = sort.split('_')[1];

        if (name !== 'delivery') {
            searchFlats.sort((flat, flat2) => {
                if (value === '1') {
                    return flat[name] - flat2[name];
                } else {
                    return flat2[name] - flat[name];
                }
            });
        } else {
            searchFlats.sort((flat, flat2) => {
                if (value === '1') {
                    if (new Date(flat[name]) > new Date(flat2[name])) {
                        return 1;
                    } else if ( new Date(flat[name]) < new Date(flat2[name])) {
                        return -1;
                    } else {
                        return 0;
                    }
                } else {
                    if (new Date(flat[name]) > new Date(flat2[name])) {
                        return -1;
                    } else if ( new Date(flat[name]) < new Date(flat2[name])) {
                        return 1;
                    } else {
                        return 0;
                    }
                }
            });
        }
    }

    public getMetaTags(): Observable<TagInterface[]> {
        return this.http.get<TagInterface[]>('/api/meta_get_flats-search-tag');
    }
}
