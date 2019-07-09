import { fromEvent } from 'rxjs';
import { BUILDER_MARKERS, IBuilderMarker, IGenplanMarker, GENPLAN_MARKERS } from './about-builder.markers';
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

    public carousel;

    public markersFallingState: string = 'inactive';

    public markersInnerOpacityState: string = 'inactive';

    public markers: IBuilderMarker[] = BUILDER_MARKERS;

    public genplans: IGenplanMarker [] = GENPLAN_MARKERS;

    private scrollEvent;

    constructor(
        private elRef: ElementRef,
        private platform: PlatformDetectService
    ) { this.carousel = true;}

    public ngOnInit() {
        $('.swiper-wrapper-about').owlCarousel({

            items: 3,
            autoWidth: true,
            margin: 10,
            nav: true,
            loop: false,
            dots: false,
        });

        this.carousel = true;
    }

    public ngAfterViewInit() {
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
