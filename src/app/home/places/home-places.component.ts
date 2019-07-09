import {Component, Input, OnInit} from '@angular/core';
import {GALLERY_UPLOADS_PATH, IGallerySnippet} from '../../../../serv-files/serv-modules/gallery-api/gallery.interfaces';
import {AuthorizationObserverService} from '../../authorization/authorization.observer.service';
import * as moment from 'moment';
import { HomeService } from '../home.service';
declare let $: any;
declare let Swiper: any;

@Component({
    selector: 'app-home-places',
    templateUrl: './home-places.component.html',
    styleUrls: [
        './home-places.component.scss'
    ],
    providers: [
    ]
})

export class HomePlacesComponent implements OnInit {

    public uploadsPath: string = `/${GALLERY_UPLOADS_PATH}`;

    public isAuthorizated: boolean = false ;

    public AuthorizationEvent;

    public currentSlide: number = 0;

    public isShowModalAdmin: boolean = false;

    @Input() public gallerySlides: IGallerySnippet[];

    constructor(
        private authorization: AuthorizationObserverService,
        public homeService: HomeService
    ) {}

    public ngOnInit() {

        // ToDo отфильтровать картинки галлереи по типу
        // this.gallerySlides.filter((slide) => slide.type === EnumGallerySnippet.PLACES);
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
