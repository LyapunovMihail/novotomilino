import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { INewsSnippet } from '../../../serv-files/serv-modules/news-api/news.interfaces';
import { Share } from '../../../serv-files/serv-modules/shares-api/shares.interfaces';
import { adminHeaders } from '../commons/admin-headers.utilit';
import { IGallerySnippet } from '../../../serv-files/serv-modules/gallery-api/gallery.interfaces';
import { IHomeDescription, IHomePreview, IHomeVideo } from '../../../serv-files/serv-modules/home-api/home.interfaces';

@Injectable()

export class HomeService { 

    private subject = new BehaviorSubject<boolean>( true );

    constructor( private http: HttpClient ) { }

    public getNews(): Observable<INewsSnippet[]> {
        return this.http.get<INewsSnippet[]>('/api/news/all');
    }

    public getShares(): Observable<{length: number, sharesList: Share[]}> {
        return this.http.get<{length: number, sharesList: Share[]}>(`/api/shares/list?limit=1000&skip=0`);
    }

    public getGallerySnippet(type): Observable<IGallerySnippet[]> {
        return this.http.get<IGallerySnippet[]>('/api/gallery', {params: {type}});
    }

    public changeDescription(id,  description) {
        let message = JSON.stringify({ id, description });
        return this.http.post('/api/admin/gallery/update/description', message, adminHeaders());
    }
    public changeName(id, name) {
        let message = JSON.stringify({ id, name });
        return this.http.post('/api/admin/gallery/update/name', message, adminHeaders());
    }

    public getHeaderDescription(): Observable<IHomeDescription> {
        return this.http.get<IHomeDescription>('/api/home/header');
    }

    public getHomePreview(): Observable<IHomePreview> {
        return this.http.get<IHomePreview>('/api/home/preview');
    }

    public getPreviewVideo(): Observable<IHomeVideo> {
        return this.http.get<IHomeVideo>('/api/home/video');
    }

    public setHouse(val) {
        this.subject.next( val );
    }
    public getHouse() {
        return this.subject.asObservable( );
    }
}
