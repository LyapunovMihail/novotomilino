import { Component, HostListener, Input, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { INewsSnippet } from '../../../../serv-files/serv-modules/news-api/news.interfaces';
import { Share } from '../../../../serv-files/serv-modules/shares-api/shares.interfaces';
import * as moment from 'moment';
import {
    EnumGallerySnippet,
    GALLERY_UPLOADS_PATH,
    IGallerySnippet
} from '../../../../serv-files/serv-modules/gallery-api/gallery.interfaces';
import { AuthorizationObserverService } from '../../authorization/authorization.observer.service';
import { HomeService } from '../home.service';
import { PlatformDetectService } from '../../platform-detect.service';
import { WindowScrollLocker } from '../../commons/window-scroll-block';
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

    public isAuthorizated: boolean = false ;

    public AuthorizationEvent;

    public currentSlide: number = 0;

    public isShowModalAdmin: boolean = false;

    public showTrojka: boolean = false;

    public slideWidth = document.documentElement.clientWidth;

    public gallerySlides: IGallerySnippet[];

    public activeNews= 0;

    public activeShare = 0;

    private newsTimer;

    private sharesTimer;

    public homePreview;

    @Input() public newsShares;
    @Output() public showVideo = new EventEmitter<any>();
    public showVideoAdmin = false;
    public videoContent;

    constructor(
        public platform: PlatformDetectService,
        private authorization: AuthorizationObserverService,
        public windowScrollLocker: WindowScrollLocker,
        public homeService: HomeService
    ) {}

    public ngOnInit() {

        if ( !this.platform.isBrowser ) { return false; }

        this.AuthorizationEvent = this.authorization.getAuthorization().subscribe( (val) => {
            this.isAuthorizated = val;
        });
        this.homeService.getPreviewVideo().subscribe(
            data => {
                console.log(data);
                this.videoContent = data;
            },
            err => console.log(err)
        );

        this.prepareMainNewsSnippets();

        this.homeService.getHomePreview().subscribe(
            data => this.homePreview = data,
            error => console.log(error)
        );

        setTimeout( () => {
            this.newsSlider(this.newsShares);
        });
    }
    
    prepareMainNewsSnippets() {
        // this.newsShares.reverse();
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

    public changeDescr(descr) {
        this.homePreview.description = descr;
        console.log('this.homePreview', this.homePreview);
        this.homeService.updateHomePreview(this.homePreview).subscribe(
            data => {
                this.homePreview = data;
                console.log(data);
            }
        );
    }
    public changeTitle(title) {
        this.homePreview.title = title;
        this.homeService.updateHomePreview(this.homePreview).subscribe(
            data => {
                this.homePreview = data;
                console.log(data);
            }
        );
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

    ngOnDestroy() {
        if ( !this.platform.isBrowser ) { return false; }
        this.AuthorizationEvent.unsubscribe();

        if (this.newsTimer) {
            clearInterval(this.newsTimer);
        }
        if (this.sharesTimer) {
            clearInterval(this.sharesTimer);
        }
    }

    @HostListener('document:click', ['$event'])
    public onDocumentClick(event) {
        const trojkaDiv = $('.main__preview-threeRed');
        if (!trojkaDiv.is(event.target) && !trojkaDiv.has(event.target).length) {
            this.showTrojka = false;
        } else {
            this.showTrojka = true;
        }
    }
}
