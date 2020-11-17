import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { HomeService } from './home.service';
import { map } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { INewsSnippet } from '../../../serv-files/serv-modules/news-api/news.interfaces';
import { Share } from '../../../serv-files/serv-modules/shares-api/shares.interfaces';
import { PlatformDetectService } from '../platform-detect.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
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
    public isDescription;

    constructor(
        public platform: PlatformDetectService,
        private homeService: HomeService
    ) {}

    public ngOnInit() {

        if ( !this.platform.isBrowser ) { return false; }

        combineLatest(
            this.homeService.getShares(),
            this.homeService.getNews()
        ).pipe(map(([shares, news]) => {
                this.newsSnippets = news;
                this.shareSnippets = this.filterExpiredShares(shares.sharesList);
                return [...this.shareSnippets, ...this.newsSnippets];
            })
        ).subscribe(
            (data: any[]) => {
                this.allSnippets = data;
                this.sortByDateOfCreate(this.allSnippets);
                this.newsLoaded = true;
            },
            (err) => console.log(err)
        );
    }

    private countDown(finishDate) {
        const createdDateVal = moment(Date.now());
        const finishDateVal = moment(finishDate);
        const duration = moment.duration(createdDateVal.diff(finishDateVal));
        return Math.ceil(duration.asDays() * -1);
    }

    private filterExpiredShares(shares) {
        return shares.filter((share) => !share.countdown || (share.countdown && this.countDown(share.finish_date) >= 0));
    }

    private sortByDateOfCreate(snippets) {
        snippets.sort((a, b) => {
            return new Date(a.created_at) > new Date(b.created_at) ? -1 : 1;
        });
    }

}
