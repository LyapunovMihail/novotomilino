import { from, fromEvent } from 'rxjs';
import { BUILDER_MARKERS, IBuilderMarker } from './about-builder.markers';
import { PlatformDetectService } from './../../platform-detect.service';
import { Component, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
declare let $: any;

@Component({
    selector: 'app-about-builder',
    templateUrl: './about-builder.component.html',
    styleUrls: ['./about-builder.component.scss', './../about.component.scss'],
    providers : [
        PlatformDetectService
    ],
    animations: [
        trigger('markersFalling', [
            state('inactive', style({
                transform: 'translateY(-100vh)'
            })),
            state('active',   style({
                transform: 'translateY(0)'
            })),
            transition('inactive => active', animate('700ms ease-in'))
        ]),
        trigger('markersInnerOpacity', [
            state('inactive', style({
                opacity: '0'
            })),
            state('active',   style({
                opacity: '1'
            })),
            transition('inactive => active', animate('700ms ease-in'))
        ])
    ]
})

export class AboutBuilderComponent implements OnInit, AfterViewInit {

    public markersFallingState: string = 'inactive';

    public markersInnerOpacityState: string = 'inactive';

    public markers: IBuilderMarker[] = BUILDER_MARKERS;

    public readMore = false;

    private scrollEvent;

    constructor (
        private elRef: ElementRef,
        private platform: PlatformDetectService
    ) { }

    ngOnInit() {
        if (window.innerWidth >= 599 || document.documentElement.clientWidth >= 599 || document.body.clientWidth >= 599) {
            this.readMore = true;
        }

        $('.swiper-wrapper').owlCarousel({

            nav: false,
            margin: 10,
            items: 1,
            autoWidth: true,
            dots: false,
            responsive : {
                0 : {

                    items: 1
                }
            }
        });

        $('.builder_photo_contain_item').on('click', function() {

            if($('.builder_photo_contain_item').hasClass('builder_photo_active')) {

                $('.builder_photo_contain_item').not(this).removeClass('builder_photo_active');
                $('.builder_photo_contain_item').not(this).find('.builder_photo_contain_item_place').removeClass('builder_photo_item_active');
                $(this).toggleClass('builder_photo_active');
                $(this).find('.builder_photo_contain_item_place').toggleClass('builder_photo_item_active');
            } else {
                $(this).addClass('builder_photo_active');
                $(this).find('.builder_photo_contain_item_place').addClass('builder_photo_item_active');
            }
        });
    }

    ngAfterViewInit() {
        this.scroll();
    }

    private scroll() {
        if (!this.platform.isBrowser) { return false; }
      //  this.scrollEvent = fromEvent(window, 'scroll')
       // .subscribe(() => {
            if (this.platform.isBrowser) {
                let container = this.elRef.nativeElement.querySelector('.builder');
                if ( container.getBoundingClientRect().top < window.innerHeight / 2 ) {
                //    this.scrollEvent.unsubscribe();
                    this.markersFallingState = 'active';
                    setTimeout(() => {
                        this.markersInnerOpacityState = 'active';
                    }, 700);
                }
            }
      //  });
    }
}
