import { WindowScrollLocker } from '../commons/window-scroll-block';
import { MapService } from './map/map.service';
import {
    Component, OnInit, ElementRef, Inject, OnDestroy, HostListener
} from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { PlatformDetectService } from '../platform-detect.service';
import { HomeService } from './home.service';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';
import {ITriggerSnippet} from '../../../serv-files/serv-modules/trigger-api/trigger.interfaces';
declare let $: any;

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: [
        './home.component.scss'
    ],
    providers: [
        PlatformDetectService,
        WindowScrollLocker,
        MapService
    ]
})

export class HomeComponent implements OnInit, OnDestroy {

    public mainSnippets: any[] = [];
    public activeShare = 0;
    public triggerSnippets: ITriggerSnippet[] = [];
    private timer;

    constructor(
        public windowScrollLocker: WindowScrollLocker,
        @Inject(DOCUMENT) private document: any,
        public platform: PlatformDetectService,
        public mapService: MapService,
        private homeService: HomeService
    ) {}

    public ngOnInit() {

        this.mapService.initMap();

        $('.header__fixed').removeClass('header__fixed-hide');

        $(window).scroll(function() {

            const scrollWindow = $(window).scrollTop();
            const startHeight = $('.main').height();

            if (scrollWindow > startHeight) {

                $('.scroll__up').show();

            } else {

                $('.scroll__up').hide();
            }
        });

        $('.scroll__up').click(function() {

            $('html, body').animate({ scrollTop: 0}, 'slow');

            return false;
        });

        $('[data-plan-js]').click(function() {

            $(this).closest('.planning__item').find('.planning__wrap .render__cheme').removeClass('planning__img--active').prev().addClass('planning__img--active');
            $(this).closest('.planning__buttons').find('.planning__cheme').removeClass('planning__active').prev().addClass('planning__active');
        });

        $('[data-cheme-js]').click(function() {

            $(this).closest('.planning__item').find('.planning__wrap .render__img').removeClass('planning__img--active').next().addClass('planning__img--active');
            $(this).closest('.planning__buttons').find('.planning__render').removeClass('planning__active').next().addClass('planning__active');
        });

        $('.swiper-wrapper').owlCarousel({

            nav: true,
            dots: false,
            responsive : {
                0 : {

                    items: 1
                },
                600 : {

                    items: 3,
                    autoWidth: true,
                    margin: 15
                }
            }
        });

        combineLatest(
            this.homeService.getShares(),
            this.homeService.getMainNews()
        ).pipe(map(([shares, news]) => [...shares.sharesList, ...news])
        ).subscribe(
            (data: any[]) => {
                this.mainSnippets = data;
                this.newsSlider(this.mainSnippets);
            },
            (err) => console.log(err)
        );

        this.homeService.getTriggerSnippet().subscribe(
            (data) => { this.triggerSnippets = data; console.log('this.triggerSnippets: ', this.triggerSnippets);},
            (err) => console.log(err)
        );
    }

    public ngOnDestroy() {
        if ( !this.platform.isBrowser ) { return false; }
        if (this.timer) {
            this.clearInterval();
        }
    }

    public countDown(finishDate) {
        const createdDateVal = moment(Date.now());
        const finishDateVal = moment(finishDate);
        const duration = moment.duration(createdDateVal.diff(finishDateVal));
        return Math.ceil(duration.asDays() * -1);
    }

    public newsSlider(sharesList) {
        if ( !this.platform.isBrowser ) { return false; }
        if (sharesList.length > 1) {
            this.timer = setInterval(() => {
                this.activeShare = this.activeShare < sharesList.length - 1 ? this.activeShare + 1 : 0;
            }, 6000);
        }
    }

    public clearInterval() {
        clearInterval(this.timer);
    }

    public scrollToTop() {
        if ( !this.platform.isBrowser ) { return false; }
        $('html, body').animate({ scrollTop: 0 }, 500);
    }
}
