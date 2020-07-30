import { Component, OnDestroy, AfterViewInit } from '@angular/core';
import { navMenu } from '../about.markers';
import { WindowEventsService } from '../../commons/window-events.observer.service';
declare const $: any;

@Component({
    selector: 'app-about-nav-menu',
    templateUrl: 'nav-menu.component.html',
    styleUrls: ['./nav-menu.component.scss']
})

export class AboutNavMenuComponent implements OnDestroy, AfterViewInit {

    public points = navMenu;
    public activePoint;
    public scrollEvent;
    public scrollToClick = false;
    public isHidden = true;

    constructor(
        public eventService: WindowEventsService
    ) { }

    ngOnDestroy() {
        if (this.scrollEvent) {
            this.scrollEvent.unsubscribe();
        }
    }
    ngAfterViewInit() {
        setTimeout(() => {
            this.getCoords();
            this.scrollSubscribe();
        }, 2000);
    }

    public getCoords() {
        this.points = this.points.map( (item, i) => {
            if (i === 0 ) { return item; }
            if (document.querySelector(`#${item.anchor}`)) {
                const el = document.querySelector(`#${item.anchor}`);
                const elOffset = el.getBoundingClientRect().top;
                item.offsetTop = elOffset;
                return item;
            }
        }).filter( item => item );
        setTimeout(() => this.isHidden = false);
    }
    public scrollSubscribe() {
        let scrollTop = 0;
        let scrollTopPrev = 0;
        const headerHeight = 64 + 56;

        this.setClassInit();

        this.scrollEvent = this.eventService.onScroll.subscribe(ev => {
            this.getCoords();
            scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

            this.changeActivePoint(headerHeight);

            scrollTopPrev = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        });
    }
    public changeActivePoint(headerHeight) {
        if (this.scrollToClick) { return; }
        this.points.forEach( item => {
            if ((item.offsetTop - headerHeight) < 0) {
                this.activePoint = item.anchor;
            }
        });
    }
    public scrollToAnchor(item) {
        const margin = item.offsetTop !== 0 ? 30 : 0;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        this.scrollToClick = true;
        this.activePoint = item.anchor;

        $('body,html').animate({
            scrollTop: item.offsetTop !== 0 ? (item.offsetTop - margin) + scrollTop : 0
        }, 500, () => this.scrollToClick = false);
    }
    public setClassInit() {
        const headerHeight = 64 + 56;
        this.points.forEach( item => {
            if ((item.offsetTop - headerHeight) < 0) {
                this.activePoint = item.anchor;
            }
        });
    }
}
