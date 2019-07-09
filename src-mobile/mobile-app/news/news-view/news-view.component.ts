import { INewsSnippet, NEWS_UPLOADS_PATH } from '../../../../serv-files/serv-modules/news-api/news.interfaces';
import { NewsService } from './../news.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-news-view',
    templateUrl: './news-view.component.html',
    styleUrls: ['./news-view.component.scss', './../news.component.scss']
})

export class NewsViewComponent implements OnInit {

    public category: string = '';

    public createdAt: string = '';

    public title: string = '';

    public description: string = '';

    public image: string = '';

    constructor (
        private activatedRoute: ActivatedRoute,
        private newsService: NewsService,
        private router: Router
    ) { }

    public ngOnInit() {
        let id = this.activatedRoute.snapshot.params.id;
        this.getSnippet(id);
    }

    public getSnippet(id) {
        this.newsService.getSnippetById(id).subscribe(
            (data) => {
                if ( data.length === 1 ) {
                    this.category = data[0].category;
                    this.createdAt = data[0].created_at;
                    this.title = data[0].title;
                    this.description = data[0].description;
                    this.image = `/${NEWS_UPLOADS_PATH}${data[0].image}`;
                } else {
                    this.router.navigate(['/error-404'], { skipLocationChange: true });
                }
            },
            (err) => {
                this.router.navigate(['/error-404'], { skipLocationChange: true });
                console.error(err);
            }
        );
    }

}
