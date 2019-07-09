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

        $('[data-anchor-js]').click(function(e) {

            let anchor = $(this).attr('data-section');

            $('.header__nav').removeClass('header__nav-show');
            $('.header__hamburger').removeClass('header__hamburger__active');
            $('.overlay-nav').fadeOut();
            $('body').css('overflow', 'visible');
            $('.header__fixed').removeClass('header__fixed-hide');
            $('.header__logo').removeClass('header__logo-hide');

            $('html, body').animate({scrollTop: $('.scroll-section[data-section=' + anchor + ']').offset().top}, 700);
        });

        $('[data-toggle-js]').click(function () {

            if ($(this).hasClass('header__hamburger__active')) {

                $(this).removeClass('header__hamburger__active');
                $('.header__nav').removeClass('header__nav-show');
                $('body').css('overflow', 'visible');
                $('.overlay-nav').fadeOut();
                $('.header__fixed').removeClass('header__fixed-hide');
                $('.header__logo').removeClass('header__logo-hide');

            } else {

                $(this).addClass('header__hamburger__active');
                $('.header__nav').addClass('header__nav-show');
                $('body').css('overflow', 'hidden');
                $('.overlay-nav').fadeIn();
                $('.header__fixed').addClass('header__fixed-hide');
                $('.header__logo').addClass('header__logo-hide');
            }
        });




        this.router.events
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((event) => {
                if (event instanceof NavigationEnd) {

                    $('.header__nav').removeClass('header__nav-show');
                    $('.header__hamburger').removeClass('header__hamburger__active');
                    $('.overlay-nav').fadeOut();
                    $('body').css('overflow', 'visible');
                    $('.header__fixed').removeClass('header__fixed-hide');
                    $('.header__logo').removeClass('header__logo-hide');

                    if (this.router.url === '/') {
                        this.fixedHeaderOnScroll();
                        this.isFixedHeader();
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
            $('.header__nav').removeClass('header__nav-show');
            $('.header__hamburger').removeClass('header__hamburger__active');
            $('.overlay-nav').fadeOut();
            $('body').css('overflow', 'visible');
            $('.header__fixed').removeClass('header__fixed-hide');
            $('.header__logo').removeClass('header__logo-hide');
        } else {
            this.router.navigate(['/'])
                .then(() => {
                    $('html, body').animate({scrollTop: $('.office').offset().top}, 700);
                    $('.header__nav').removeClass('header__nav-show');
                    $('.header__hamburger').removeClass('header__hamburger__active');
                    $('.overlay-nav').fadeOut();
                    $('body').css('overflow', 'visible');
                    $('.header__fixed').removeClass('header__fixed-hide');
                    $('.header__logo').removeClass('header__logo-hide');
                });
        }
    }

    // если расстояние скрлла больше высоты одного экрана
    // хедер фиксируется
    public fixedHeaderOnScroll() {
        this.subscriptions.push(this.windowEventsService.onScroll.subscribe(() => {
            this.isFixedHeader();
        }));
    }

    private isFixedHeader() {
        let windowHeight = document.querySelector('.main').clientHeight;
        let winScrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

        if (winScrollTop >= windowHeight) {
            this.isFixed = true;
        } else {
            this.isFixed = false;
        }
    }
}
