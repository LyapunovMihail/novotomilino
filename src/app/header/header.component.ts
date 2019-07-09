import { WindowEventsService } from '../commons/window-events.observer.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { HeaderService, IHeaderLink } from './header.service';

declare let $: any;

@Component({
    selector : 'app-header',
    templateUrl : './header.component.html',
    styleUrls : ['./header.component.scss'],
    providers : [HeaderService]
})

export class HeaderComponent implements OnInit, OnDestroy {

    public isFixed: boolean;
    public pageWithOffice: boolean;
    public links = [];

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
        this.pageWithOffice = false;
    }

    public ngOnInit() {

        this.router.events
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((event) => {
                if (event instanceof NavigationEnd) {
                    if (this.router.url === '/') {
                        this.fixedHeader();
                        this.isFixed = false;
                        this.pageWithOffice = true;
                    } else {
                        this.subscriptions.forEach((sub) => {
                            sub.unsubscribe();
                        });
                        this.isFixed = true;
                        this.pageWithOffice = false;
                    }
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
                    let date = new Date();
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

    public scrollToOffice() {
        if (this.pageWithOffice) {
            $('html, body').animate({scrollTop: $('.office').offset().top}, 700);
        } else {
            this.router.navigate(['/'])
                .then(() => {
                    $('html, body').animate({scrollTop: $('.office').offset().top}, 700);
                });
        }
    }

    // если расстояние скрлла больше высоты одного экрана
    // хедер фиксируется
    public fixedHeader() {
        this.subscriptions.push(this.windowEventsService.onScroll.subscribe(() => {
            let windowHeight = document.querySelector('.main').clientHeight;
            let winScrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

            if (winScrollTop >= windowHeight) {
                this.isFixed = true;
            } else {
                this.isFixed = false;
            }
        }));
    }
}
