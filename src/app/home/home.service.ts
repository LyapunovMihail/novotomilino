import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { INewsSnippet } from '../../../serv-files/serv-modules/news-api/news.interfaces';
import { Share } from '../../../serv-files/serv-modules/shares-api/shares.interfaces';
import { adminHeaders } from '../commons/admin-headers.utilit';
import { IGallerySnippet } from '../../../serv-files/serv-modules/gallery-api/gallery.interfaces';

@Injectable()

export class HomeService {

    constructor( private http: HttpClient ) { }

    public getMainNews(): Observable<INewsSnippet[]> {
        return this.http.get<INewsSnippet[]>('/api/news/main');
    }

    public getShares(): Observable<{length: number, sharesList: Share[]}> {
        return this.http.get<{length: number, sharesList: Share[]}>(`/api/shares/list?limit=1000&skip=0`);
    }

    public getGallerySnippet(): Observable<IGallerySnippet[]> {
        return this.http.get<IGallerySnippet[]>('/api/gallery');
    }

    public changeDescription(id,  description) {
        let message = JSON.stringify({ id, description });
        return this.http.post('/api/admin/gallery/update/description', message, adminHeaders());
    }
}
