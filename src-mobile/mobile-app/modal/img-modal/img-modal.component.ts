import { WindowScrollLocker } from '../../commons/window-scroll-block';
import { Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ImgModalService } from './img-modal.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
    selector: 'app-img-modal',
    template: `
        <div class="modal-plan">
            <div>
                <img src="" alt="">
            </div>
        </div>
    `,
    styleUrls: ['./img-modal.component.scss'],
    providers: [
        WindowScrollLocker
    ]
})
export class ImgModalComponent implements OnInit, OnDestroy {

    public visible: boolean;

    private subs: Subscription[] = [];
    private _ngUnsubscribe: Subject<any> = new Subject();

    constructor(
        private imgModalService: ImgModalService,
        private windowScrollLocker: WindowScrollLocker
    ) {}

    ngOnInit() {
        this.subs.push(
            this.imgModalService.getImgVisibility
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
        this.imgModalService.changeImgVisibility(false);
        this.windowScrollLocker.unblock();
    }
}
