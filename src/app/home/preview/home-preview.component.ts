import {Component, Input, OnInit} from '@angular/core';
import {INewsSnippet} from '../../../../serv-files/serv-modules/news-api/news.interfaces';
import {Share} from '../../../../serv-files/serv-modules/shares-api/shares.interfaces';
import * as moment from 'moment';
import {
    GALLERY_UPLOADS_PATH,
    IGallerySnippet
} from '../../../../serv-files/serv-modules/gallery-api/gallery.interfaces';
import { AuthorizationObserverService } from '../../authorization/authorization.observer.service';
import { HomeService } from '../home.service';

declare let $: any;
declare let Swiper: any;

@Component({
    selector: 'app-home-preview',
    templateUrl: './home-preview.component.html',
    styleUrls: [
        './home-preview.component.scss'
    ]
})

export class HomePreviewComponent implements OnInit {

    public uploadsPath: string = `/${GALLERY_UPLOADS_PATH}`;

    public isAuthorizated: boolean = false ;

    public AuthorizationEvent;

    public currentSlide: number = 0;

    public isShowModalAdmin: boolean = false;

    public slideWidth = document.documentElement.clientWidth;

    @Input() public gallerySlides: IGallerySnippet[];
    @Input() public newsSnippets: INewsSnippet[];
    @Input() public shareSnippets: Share[];

    public newsSnippet: INewsSnippet;
    public shareSnippet: Share;

    constructor(
        private authorization: AuthorizationObserverService,
        public homeService: HomeService
    ) {}

    public ngOnInit() {

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

        // ToDo отфильтровать картинки галлереи по типу
        // this.gallerySlides.filter((slide) => slide.type === EnumGallerySnippet.PREVIEW);

        this.AuthorizationEvent = this.authorization.getAuthorization().subscribe( (val) => {
            this.isAuthorizated = val;
        });

        this.homeService.getGallerySnippet().subscribe(
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
}
