import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { WindowEventsService } from '../commons/window-events.observer.service';
import { WindowScrollLocker } from '../commons/window-scroll-block';
import { FavoritesService } from '../favorites/favorites.service';
import { HeaderService } from './header.service';

declare let $: any;


@Component({
    selector : 'app-header',
    templateUrl : './header.component.html',
    styleUrls : ['./header.component.scss'],
    providers : [
        HeaderService,
        WindowScrollLocker
    ]
})

export class HeaderComponent implements OnInit, OnDestroy {

    public links = [];
    public active = false;
    public isFixed: boolean;
    public isHidden: boolean;
    public favoriteCounter;

    public phone;

    // подписка на скролл страницы HomePage
    // для фиксации хедера
    private ngUnsubscribe: Subject<void> = new Subject<void>();
    private subscriptions: Subscription[] = [];

    constructor(
        public favoritesService: FavoritesService,
        private windowEventsService: WindowEventsService,
        public  windowScrollLocker: WindowScrollLocker,
        private headerService: HeaderService,
        private router: Router,
    ) {
    }

    public ngOnInit() {

        this.favoritesService.getFavoriteCount().subscribe(count => {
            this.favoriteCounter = count;
        });

        // this.fixedHeader();
        this.headerService.getPhone().subscribe(data => this.phone = data['phone']);
        this.headerService.getDynamicLink()
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(
                (data: any) => {
                    const date = new Date();
                    this.headerService.linksData.dynamic = {
                        year: (data.year) ? data.year : date.getFullYear(),
                        month: (data.month) ? data.month : (date.getMonth() + 1)
                    };
                    this.getDecorationFurnitureLink();
                },
                (err) => {
                    console.error(err);
                    const date = new Date();
                    this.headerService.linksData.dynamic = {
                        year: date.getFullYear(),
                        month: date.getMonth() + 1
                    };
                    this.getDecorationFurnitureLink();
                }
            );

        this.router.events.subscribe((event) => {
            if (!(event instanceof NavigationEnd)) {
                return;
            }

            this.fixedHeader();
        });

    }
    public getDecorationFurnitureLink() {
        this.headerService.getDecorationFurnitureLink()
            .subscribe(
                (data) => {
                    if (data.length) {
                        this.headerService.linksData.furniture = {
                            link: `/decoration/furniture/type/${data[0].types[0].type}/vendor/${data[0].vendor}/room/${data[0].types[0].rooms}`
                        };
                    } else {
                        this.headerService.linksData.furniture = {
                            link: null
                        };
                    }
                    this.links = this.headerService.links();
                },
                (err) => {
                    console.error(err);
                    this.headerService.linksData.furniture = {
                        link: null
                    };
                    this.links = this.headerService.links();
                }
            );
    }

    public ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();

    }

    public toggleNav() {
        this.active = !this.active;
        if (this.active) {
            $('.ch-spot').hide();
            this.windowScrollLocker.block();
        }
        if (!this.active) {
            $('.ch-spot').show();
            this.windowScrollLocker.unblock();
        }
    }

    public closeNav() {
      this.active = false;
      this.windowScrollLocker.unblock();
    }

    public showFullVersion() {
        this.headerService.writeSessionForFullVersion().pipe(takeUntil(this.ngUnsubscribe)).subscribe(
          (data) => document.location.reload(true),
          (error) => console.log(error)
        );
    }

    // если расстояние скрлла больше высоты хедера
    // хедер фиксируется
    public fixedHeader() {

        let winScrollTopPrev = 0;

        this.subscriptions.push(this.windowEventsService.onScroll.subscribe(() => {

            const headerHeight = document.querySelector('.header').clientHeight;
            const winScrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

            if (winScrollTop > headerHeight || this.active) {
                this.isFixed = true;
            } else if (winScrollTop < headerHeight) {
                this.isFixed = false;
            }

            if (winScrollTop < headerHeight || winScrollTopPrev > winScrollTop) {
                this.isHidden = false;
            } else if (winScrollTopPrev < winScrollTop) {
                this.isHidden = true;
            }

            winScrollTopPrev = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        }));
    }
}
