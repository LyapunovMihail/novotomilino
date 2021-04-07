import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import * as moment from 'moment';
declare let Swiper: any;

@Component({
    selector: 'app-apartment-furniture-slideshow',
    templateUrl: './apartment-furniture-slideshow.component.html',
    styleUrls: ['./apartment-furniture-slideshow.component.scss']
})

export class ApartmentFurnitureSlideshowComponent implements OnChanges {

    @Input() slides: {url: string}[] = [];
    @Input() isSlideShow = false;

    @Output() close: EventEmitter<boolean> = new EventEmitter();

    public dynamicSlider;
    public visibleSlider = false;

    ngOnChanges() {
        setTimeout(() => {
            this.swiperInit();
            this.slideTo(0);
        }, 200);
    }

    public slideTo(slide) {
        if ( !this.isSlideShow ) {
            this.visibleSlider = false;
            return;
        }

        this.dynamicSlider.slideTo((slide), 0);
        this.visibleSlider = true;
    }

    public swiperInit() {
        this.dynamicSlider = new Swiper('.swiper-dynamic', {
            speed: 700,
            loop: false,
            effect: 'fade',
            // slideActiveClass: 'dynamic-modal__img--active',
            navigation: {
              nextEl: '.dynamic-modal__btn_right',
              prevEl: '.dynamic-modal__btn_left'
            }
        });
    }

}
