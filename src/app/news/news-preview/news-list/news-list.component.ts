import { WindowScrollLocker } from './../../../commons/window-scroll-block';
import { INewsSnippet, NEWS_UPLOADS_PATH } from '../../../../../serv-files/serv-modules/news-api/news.interfaces';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector : 'app-news-list',
    templateUrl : './news-list.component.html'
})

export class NewsListComponent {

    @Input() public isAuthorizated: boolean = false;

    @Input() public snippetsArray: INewsSnippet[] = [];

    @Output() public deleteSnippet = new EventEmitter();

    @Output() public redactSnippet = new EventEmitter();

    public uploadsPath: string = `/${NEWS_UPLOADS_PATH}`;

    constructor() { }

}
