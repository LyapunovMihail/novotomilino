import { Component, Input, OnInit } from '@angular/core';
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

export class HomePreviewComponent implements OnInit {

    public uploadsPath: string = `/${GALLERY_UPLOADS_PATH}`;

    public isAuthorizated: boolean = false ;

    public AuthorizationEvent;

    public currentSlide: number = 0;

    public isShowModalAdmin: boolean = false;

    public showTrojka: boolean = false;

    public slideWidth = document.documentElement.clientWidth;

    public gallerySlides: IGallerySnippet[];

    @Input() public newsSnippets: INewsSnippet[];
    @Input() public shareSnippets: Share[];

    public newsSnippet: INewsSnippet;
    public shareSnippet: Share;

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

        this.newsSnippet = this.newsSnippets[0];

        this.shareSnippets.reverse();
        // ToDo добавить св-во show_on_main и выводить первую из этих шар на главную
        this.shareSnippets.forEach((share) => {
            if (share.show_on_main) {
                this.shareSnippet = share;
                this.shareSnippet.finish_date = this.countDown(share.finish_date) + '';
            }
        });

        // this.shareSnippet = this.shareSnippets[0];
        // this.shareSnippet.finish_date = this.countDown(this.shareSnippet.finish_date) + '';

        this.homeService.getGallerySnippet(EnumGallerySnippet.PREVIEW).subscribe(
            (data: IGallerySnippet[]) => {
                this.gallerySlides = data;
            },
            (err) => console.log(err)
        );
    }

    public countDown(finishDate) {
        let createdDateVal = moment(Date.now());
        let finishDateVal = moment(finishDate);
        let duration = moment.duration(createdDateVal.diff(finishDateVal));
        return Math.ceil(duration.asDays() * -1);
    }

    public nextBtn() {
        this.currentSlide = (this.currentSlide < this.gallerySlides.length - 1 ) ? this.currentSlide + 1 : this.gallerySlides.length - 1;
    }

    public prevBtn() {
        this.currentSlide = ( this.currentSlide > 0 ) ? this.currentSlide - 1 : 0 ;
    }

    public changeDescription(id, description) {
        this.homeService.changeDescription(id, description).subscribe(
            (data: IGallerySnippet[]) => this.gallerySlides = data,
            (err) => console.log(err)
        );
    }

    public changeName(id, name) {
        this.homeService.changeName(id, name).subscribe(
            (data: IGallerySnippet[]) => this.gallerySlides = data,
            (err) => console.log(err)
        );
    }
}
