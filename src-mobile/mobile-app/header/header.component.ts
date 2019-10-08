import { WindowEventsService } from '../commons/window-events.observer.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { WindowScrollLocker } from '../commons/window-scroll-block';
import { HeaderService } from './header.service';


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

    // подписка на скролл страницы HomePage
    // для фиксации хедера
    private ngUnsubscribe: Subject<void> = new Subject<void>();

    constructor(
        private windowEventsService: WindowEventsService,
        public  windowScrollLocker: WindowScrollLocker,
        private headerService: HeaderService
    ) {
    }

    public ngOnInit() {

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

    }

    public toggleNav() {
        this.active = !this.active;
        if (this.active) { this.windowScrollLocker.block(); }
        if (!this.active) { this.windowScrollLocker.unblock(); }
    }
}
