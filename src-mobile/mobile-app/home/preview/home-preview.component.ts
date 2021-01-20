import { Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import * as moment from 'moment';
import {
    EnumGallerySnippet,
    GALLERY_UPLOADS_PATH,
    IGallerySnippet
} from '../../../../serv-files/serv-modules/gallery-api/gallery.interfaces';
import { HomeService } from '../home.service';
import { PlatformDetectService } from '../../platform-detect.service';
import { WindowScrollLocker } from '../../commons/window-scroll-block';
import { combineLatest, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
declare let $: any;

@Component({
    selector: 'app-home-preview',
    templateUrl: './home-preview.component.html',
    styleUrls: [
        './home-preview.component.scss'
    ],
    providers: [
        PlatformDetectService,
        WindowScrollLocker
    ]
})

export class HomePreviewComponent implements OnInit, OnDestroy {

    public uploadsPath: string = `/${GALLERY_UPLOADS_PATH}`;

    public currentSlide = 0;

    public gallerySlides: IGallerySnippet[];

    public activeNews = 0;

    public activeShare = 0;

    private newsTimer;

    public homePreview;

    public showVideo = false;
    public videoContent;

    private ngUnsubscribe = new Subject();

    @Input() public newsShares;

    constructor(
        public platform: PlatformDetectService,
        public windowScrollLocker: WindowScrollLocker,
        public homeService: HomeService
    ) {}

    ngOnInit() {
        if ( !this.platform.isBrowser ) { return false; }

        combineLatest(
            this.homeService.getHomePreview(),
            this.homeService.getPreviewVideo(),
            this.homeService.getGallerySnippet(EnumGallerySnippet.PREVIEW),
        ).pipe( takeUntil(this.ngUnsubscribe) )
        .subscribe( ([previewText, previewVideo, gallerySnippet]) => {
            this.homePreview = previewText;
            this.videoContent = previewVideo;
            this.gallerySlides = gallerySnippet;
        });

        this.prepareMainNewsSnippets();
        setTimeout( () => this.newsSlider(this.newsShares), 1000);
    }
    ngOnDestroy() {
        if ( !this.platform.isBrowser ) { return false; }
        if (this.newsTimer) { clearInterval(this.newsTimer); }
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    prepareMainNewsSnippets() {
        this.newsShares = this.newsShares.filter((news) => {
            return news.show_on_main;
        });

        if (this.newsShares) {
            this.newsShares.forEach((snippet) => {
                if (snippet.finish_date) {
                    snippet.finish_date = this.countDown(snippet.finish_date) + '';
                }
                if (snippet.title) {
                    snippet.title = snippet.title.length < 53 ? snippet.title : snippet.title.slice(0, 50) + '...';
                }
                if (snippet.name) {
                    snippet.name = snippet.name.length < 53 ? snippet.name : snippet.name.slice(0, 50) + '...';
                }
            });
        }
    }

    public countDown(finishDate) {
        let createdDateVal = moment(Date.now());
        let finishDateVal = moment(finishDate);
        let duration = moment.duration(createdDateVal.diff(finishDateVal));
        return Math.ceil(duration.asDays() * -1);
    }

    public newsSlider(newsList) {
        if ( !this.platform.isBrowser ) { return false; }
        if (newsList.length > 1) {
            this.newsTimer = setInterval(() => {
                this.activeNews = this.activeNews < newsList.length - 1 ? this.activeNews + 1 : 0;
            }, 6000);
        }
    }
}
