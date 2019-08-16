import {NEWS_UPLOADS_PATH} from '../../../../../serv-files/serv-modules/news-api/news.interfaces';
import { NewsService } from './../news.service';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import { Component, OnInit } from '@angular/core';
import {filter, map} from 'rxjs/operators';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-news-view',
    templateUrl: './news-view.component.html',
    styleUrls: ['./../news.component.scss']
})

export class NewsViewComponent implements OnInit {

    public title: string = '';

    public description: string = '';

    public image: string = '';

    public created_at: string = '';

    public _id: string = '';
    public prevId: string = '';
    public nextId: string = '';

    public routerEvents: Subscription;

    constructor(
        private activatedRoute: ActivatedRoute,
        private newsService: NewsService,
        private router: Router
    ) { }

    public ngOnInit() {
        const id = this.activatedRoute.snapshot.params.id;
        this.routerEvents = this.router.events
            .pipe(filter((router) => (router instanceof NavigationEnd)), map((router: NavigationEnd) => router.url))
            .subscribe((router) => {
                const newId = this.activatedRoute.snapshot.params.id;
                this.getSnippet(newId);
            });
        this.getSnippet(id);
    }

    public getSnippet(id) {
        this.newsService.getSnippetById(id).subscribe(
            (data) => {
                if ( data.length === 1 ) {
                    this.title = data[0].title;
                    this.description = data[0].description;
                    this.image = `/${NEWS_UPLOADS_PATH}${data[0].image}`;
                    this.created_at = data[0].created_at;
                    this._id = data[0]._id;
                    this.getSnippets();
                } else {
                    this.router.navigate(['/error-404'], { skipLocationChange: true });
                }
            },
            (err) => {
               // this.router.navigate(['/error-404'], { skipLocationChange: true });
                console.error(err);
            }
        );
    }

    public getSnippets() {
        this.newsService.getSnippet().subscribe(
            (data) => {
                data.forEach((item, i) => {
                    if (item._id === this._id) {
                        this.prevId = i !== 0 ? data[i - 1]._id : '';
                        this.nextId = i !== data.length - 1 ? data[i + 1]._id : '';
                    }
                });
            },
            (err) => console.error(err)
        );
    }

}
