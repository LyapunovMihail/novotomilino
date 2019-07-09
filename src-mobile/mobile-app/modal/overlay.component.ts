import { WindowScrollLocker } from '../commons/window-scroll-block';
import { Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OverlayService } from './overlay.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
    selector: 'app-overlay',
    template: `
        <div class="overlay">
            <span class="overlay_exit">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <g fill="#1C1C1C" fill-rule="evenodd">
                        <path d="M.686 21.9L21.9.685l1.415 1.415L2.1 23.314z"/>
                        <path d="M23.314 21.9L2.1.685.686 2.101 21.9 23.314z"/>
                    </g>
                </svg>
            </span>
        </div>
        <div class="overlay-nav"></div>
    `,
    styleUrls: ['./overlay.component.scss'],
    providers: [
        WindowScrollLocker
    ]
})
export class OverlayComponent implements OnInit, OnDestroy {

    public visible: boolean;

    private subs: Subscription[] = [];
    private _ngUnsubscribe: Subject<any> = new Subject();

    constructor(
        private overlaylService: OverlayService,
        private windowScrollLocker: WindowScrollLocker
    ) {}

    ngOnInit() {
        this.subs.push(
            this.overlaylService.getOverlayVisibility
                .pipe(takeUntil(this._ngUnsubscribe))
                .subscribe((state: boolean) => {
                    this.visible = state;
                })
        );
    }

    ngOnDestroy() {
        this._ngUnsubscribe.next();
        this.subs.forEach((sub: Subscription) => {
            sub.unsubscribe();
        });
    }

    public closeVideo(): void {
        this.overlaylService.changeOverlayVisibility(false);
        this.windowScrollLocker.unblock();
    }
}
