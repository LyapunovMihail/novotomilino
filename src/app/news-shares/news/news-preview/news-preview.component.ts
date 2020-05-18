import { MetaTagsRenderService } from '../../../seo/meta-tags-render.service';
import { NewsService } from '../news.service';
import { AuthorizationObserverService } from '../../../authorization/authorization.observer.service';
import { WindowScrollLocker } from '../../../commons/window-scroll-block';
import { INewsSnippet, NEWS_UPLOADS_PATH } from '../../../../../serv-files/serv-modules/news-api/news.interfaces';
import { Component, ChangeDetectorRef, OnDestroy, OnInit } from '@angular/core';

@Component({
    selector: 'app-news-preview',
    templateUrl: './news-preview.component.html',
    providers: [
        WindowScrollLocker
    ]
})

export class NewsPreviewComponent implements OnInit, OnDestroy {

    public uploadsPath: string = `/${NEWS_UPLOADS_PATH}`;

    public snippetsArray: INewsSnippet[] = [];

    public isAuthorizated: boolean = false ;

    // подписка на авторизацию
    public AuthorizationEvent;

    // открытие формы создания
    public isCreateForm: boolean = false ;

    // открытие формы редактирования
    public redactId: any ;
    public isRedactForm: boolean = false ;
    public isDeleteForm: boolean = false ;

    public title = 'Новости';
    public titleEvent;

    constructor(
        private authorization: AuthorizationObserverService,
        public windowScrollLocker: WindowScrollLocker,
        private newsService: NewsService,
        private ref: ChangeDetectorRef,
        private metaTagsRenderService: MetaTagsRenderService
    ) { }

    public ngOnInit(): void {
        this.titleEvent = this.metaTagsRenderService.getH1().subscribe((updatedTitle) => {
            this.title = updatedTitle;
        });

        this.AuthorizationEvent = this.authorization.getAuthorization().subscribe((val) => {
            this.isAuthorizated = val;
        });

        this.newsService.getSnippet().subscribe(
            (data) => {
                this.snippetsArray = data;
                this.ref.detectChanges();
            },
            (err) => console.error(err)
        );
    }

    public ngOnDestroy() {
        this.AuthorizationEvent.unsubscribe();
        this.titleEvent.unsubscribe();
    }

    public createSnippet() {
        if ( this.isAuthorizated ) {
            this.isCreateForm = true ;
            this.windowScrollLocker.block();
        }
    }

    public redactSnippet(id) {
        if ( this.isAuthorizated ) {
            this.redactId = id;
            this.isRedactForm = true ;
            this.windowScrollLocker.block();
        }
    }

    public deleteSnippet(id) {
        if ( this.isAuthorizated ) {
            this.redactId = id;
            this.isDeleteForm = true ;
            this.windowScrollLocker.block();
        }
    }

    // вызывается после создания, удаления, редактирования
    public snippetsChange(data: INewsSnippet[]) {
        this.snippetsArray = data;
    }

}
