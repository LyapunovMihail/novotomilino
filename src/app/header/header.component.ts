import { WindowEventsService } from '../commons/window-events.observer.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { HeaderService } from './header.service';

declare let $: any;

@Component({
    selector : 'app-header',
    templateUrl : './header.component.html',
    styleUrls : ['./header.component.scss'],
    providers : [HeaderService]
})

export class HeaderComponent implements OnInit, OnDestroy {

    public isFixed: boolean;
    public isHidden: boolean;
    public links = [];
    public quarantineLinkHide = false;
    public headerHide = false;

    // подписка на скролл страницы HomePage
    // для фиксации хедера
    private ngUnsubscribe: Subject<void> = new Subject<void>();
    private subscriptions: Subscription[] = [];

    constructor(
        private windowEventsService: WindowEventsService,
        private headerService: HeaderService,
        private router: Router
    ) {
        this.isFixed = true;
    }

    public ngOnInit() {

        this.router.events
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((event) => {
                if (event instanceof NavigationEnd) {

                    this.fixedHeader();
                    this.quarantineLinkHide = (this.router.url !== '/') ? true : false;
                    this.headerHide = (this.router.url === '/quarantine') ? true : false;
                }
            });

        this.headerService.getDynamicLink()
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(
                (data) => {
                    this.links = this.headerService.links(data);
                },
                (err) => {
                    console.error(err);
                    const date = new Date();
                    this.links = this.headerService.links({ year: date.getFullYear(), month: ( date.getMonth() + 1 ) });
                }
            );
    }

    public ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
        this.subscriptions.forEach((sub) => {
            sub.unsubscribe();
        });
    }

    // если расстояние скрлла больше высоты хедера
    // хедер фиксируется
    public fixedHeader() {

        this.subscriptions.push(this.windowEventsService.onScroll.subscribe(() => {

            const headerHeight = document.querySelector('.header').clientHeight;
            const winScrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

            if (!this.quarantineLinkHide) {
                this.isFixed = winScrollTop > 48 ? true : false;
            } else if (this.quarantineLinkHide) {
                this.isFixed = true;
            }
        }));
    }

    public checkLink(linkUrl) {
        return this.router.url.split('/')[1] === linkUrl.split('/')[1];
    }
}
