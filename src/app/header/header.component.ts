import { WindowEventsService } from '../commons/window-events.observer.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { PlatformDetectService } from '../platform-detect.service';
import { HeaderService } from './header.service';
import { FavoritesService } from '../favorites/favorites.service';

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

    public favoriteCounter;
    public phone;

    public scrollEvent;

    // подписка на скролл страницы HomePage
    // для фиксации хедера
    private ngUnsubscribe: Subject<void> = new Subject<void>();
    private subscriptions: Subscription[] = [];

    constructor(
        public favoritesService: FavoritesService,
        private platformDetectService: PlatformDetectService,
        private windowEventsService: WindowEventsService,
        private headerService: HeaderService,
        private router: Router
    ) { }

    public ngOnInit() {
        if (this.platformDetectService.isBrowser) {

            this.favoritesService.getFavoriteCount().subscribe(count => {
                this.favoriteCounter = count;
            });
            this.headerService.getPhone().subscribe( data => this.phone = data['phone'] );
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
            
            this.fixedHeader();
        }
    }

    public ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
        this.subscriptions.forEach((sub) => {
            sub.unsubscribe();
        });
    }

    public checkLink(linkUrl) {
        if (linkUrl.split('/')[1] === 'decoration') {
            return this.router.url.split('/')[1] === 'furniture'
                || this.router.url.split('/')[1] === linkUrl.split('/')[1];
        }
        return this.router.url.split('/')[1] === linkUrl.split('/')[1];
    }

    fixedHeader() {
        let scrollTop = 0;
        let scrollTopPrev = 0;
        const headerHeight = 100;

        this.scrollEvent = this.windowEventsService.onScroll.subscribe( () => {

            scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

            if (scrollTop > scrollTopPrev) {

                if (scrollTop > headerHeight) {
                    this.isFixed = true;
                }
            } else if (scrollTop < scrollTopPrev) {
                if (scrollTop <= headerHeight) {
                    this.isFixed = false;
                }
            }

            scrollTopPrev = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        });
    }
}
