import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { INewsSnippet } from '../../../serv-files/serv-modules/news-api/news.interfaces';
import { Share } from '../../../serv-files/serv-modules/shares-api/shares.interfaces';
import { ITriggerSnippet } from '../../../serv-files/serv-modules/trigger-api/trigger.interfaces';

@Injectable()

export class HomeService {

    constructor( private http: HttpClient ) { }

    public getMainNews(): Observable<INewsSnippet[]> {
        return this.http.get<INewsSnippet[]>('/api/news-shares/main');
    }

    public getShares(): Observable<{length: number, sharesList: Share[]}> {
        return this.http.get<{length: number, sharesList: Share[]}>(`/api/shares/list?limit=1000&skip=0`);
    }

    public getTriggerSnippet(): Observable<ITriggerSnippet[]> {
        return this.http.get<ITriggerSnippet[]>(`/api/trigger`);
    }
}
