import { WindowEventsService } from '../commons/window-events.observer.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { PlatformDetectService } from '../platform-detect.service';
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

    // подписка на скролл страницы HomePage
    // для фиксации хедера
    private ngUnsubscribe: Subject<void> = new Subject<void>();
    private subscriptions: Subscription[] = [];

    constructor(
        private platformDetectService: PlatformDetectService,
        private windowEventsService: WindowEventsService,
        private headerService: HeaderService,
        private router: Router
    ) {
        this.isFixed = true;
    }

    public ngOnInit() {
        if (this.platformDetectService.isBrowser) {

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
    }

    public ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
        this.subscriptions.forEach((sub) => {
            sub.unsubscribe();
        });
    }

    public checkLink(linkUrl) {
        return this.router.url.split('/')[1] === linkUrl.split('/')[1];
    }
}
