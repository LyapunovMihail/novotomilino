import { IDynamicObject, DYNAMIC_UPLOADS_PATH } from '../../../../../serv-files/serv-modules/dynamic-api/dynamic.interfaces';
import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import * as moment from 'moment';
declare let Swiper: any;

@Component({
    selector: 'app-dynamic-object-slideshow',
    templateUrl: './dynamic-object-slideshow.component.html',
    styleUrls: ['./dynamic-object-slideshow.component.scss']
})

export class DynamicObjectSlideshowComponent implements OnChanges {

    @Input() objectsArray: IDynamicObject[] = [];
    @Input() slideShowCurrent: number = 0;
    @Input() slideShowId: any;
    @Input() isSlideShow: boolean = false;

    @Output() close: EventEmitter<boolean> = new EventEmitter();

    public uploadsPath: string = `/${DYNAMIC_UPLOADS_PATH}`;

    public slides = [];
    public currentObject: IDynamicObject;
    public dynamicSlider;
    public visibleSlider = false;

    public monthArray: any[] = [
        {
            name: 'Январь',
            value: 1,
            disabled: false
        }, {
            name: 'Февраль',
            value: 2,
            disabled: false
        }, {
            name: 'Март',
            value: 3,
            disabled: false
        }, {
            name: 'Апрель',
            value: 4,
            disabled: false
        }, {
            name: 'Май',
            value: 5,
            disabled: false
        }, {
            name: 'Июнь',
            value: 6,
            disabled: false
        }, {
            name: 'Июль',
            value: 7,
            disabled: false
        }, {
            name: 'Август',
            value: 8,
            disabled: false
        }, {
            name: 'Сентябрь',
            value: 9,
            disabled: false
        }, {
            name: 'Октябрь',
            value: 10,
            disabled: false
        }, {
            name: 'Ноябрь',
            value: 11,
            disabled: false
        }, {
            name: 'Декабрь',
            value: 12,
            disabled: false
        }
    ];

    ngOnChanges() {
        if ( this.isSlideShow ) {
            this.slides = this.objectsArray.filter((i) => {
                return i._id === this.slideShowId;
            })[0]['images'];
            this.currentObject = this.objectsArray.find((i) => {
                return i._id === this.slideShowId;
            });
        }
        setTimeout(() => {

            this.swiperInit();
            this.slideTo(this.slideShowCurrent);
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
