import { Component, OnInit } from '@angular/core';
import { HomeService } from './home.service';
import { map } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { INewsSnippet } from '../../../serv-files/serv-modules/news-api/news.interfaces';
import { Share } from '../../../serv-files/serv-modules/shares-api/shares.interfaces';
import { PlatformDetectService } from '../platform-detect.service';
import { IGallerySnippet } from '../../../serv-files/serv-modules/gallery-api/gallery.interfaces';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: [
        './home.component.scss'
    ],
    providers: [
        PlatformDetectService,
        HomeService
    ]
})

export class HomeComponent implements OnInit {

    public newsSnippets: INewsSnippet[] = [];
    public shareSnippets: Share[] = [];
    public allSnippets: any[] = [];
    public newsLoaded = false;
    public gallerySlides: IGallerySnippet[] = [];

    constructor(
        public platform: PlatformDetectService,
        private homeService: HomeService
    ) {}

    public ngOnInit() {

        if ( !this.platform.isBrowser ) { return false; }

        combineLatest(
            this.homeService.getShares(),
            this.homeService.getMainNews()
        ).pipe(map(([shares, news]) => {
                this.newsSnippets = news;
                this.shareSnippets = shares.sharesList;
                return [...shares.sharesList, ...news];
            })
        ).subscribe(
            (data: any[]) => {
                this.allSnippets = data;
                this.newsLoaded = true;
            },
            (err) => console.log(err)
        );

        this.homeService.getGallerySnippet().subscribe(
            (data: IGallerySnippet[]) => {
                this.gallerySlides = data;
            },
            (err) => console.log(err)
        );

    }

}
