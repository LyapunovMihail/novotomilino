import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import { Share, SHARES_UPLOADS_PATH, ShareFlatDiscountType } from '../../../../../../serv-files/serv-modules/shares-api/shares.interfaces';
import { SharesService } from '../../shares.service';
import {Component, OnDestroy, OnInit} from '@angular/core';
import * as moment from 'moment';
import { WindowScrollLocker } from '../../../../commons/window-scroll-block';
import {filter, map} from 'rxjs/operators';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-shares-item',
    templateUrl: './shares-item.component.html',
    styleUrls: ['./shares-item.component.scss'],
    providers: [
        WindowScrollLocker
    ]
})
export class SharesItemComponent implements OnInit, OnDestroy {

    public isReserveFormOpen: boolean = false;
    public isCallFormOpen: boolean = false;

    // public share: Share;
    public share;

    public uploadsPath: string = `/${SHARES_UPLOADS_PATH}`;

    public shareFlatDiscountType = ShareFlatDiscountType;

    public indexNum: number;

    public prevId: string = '';
    public nextId: string = '';

    public routerEvents: Subscription;

    public selectFlat = {
        house: '0',
        number: '0',
        space: '0',
        room: '0',
        price: 0
    };

    constructor(
        public windowScrollLocker: WindowScrollLocker,
        private sharesService: SharesService,
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) {}

    public ngOnInit() {
        const id = this.activatedRoute.snapshot.params.id;
        this.indexNum = Number(this.activatedRoute.snapshot.params.index);

        this.routerEvents = this.router.events
            .pipe(filter((router) => (router instanceof NavigationEnd)), map((router: NavigationEnd) => router.url))
            .subscribe((router) => {
                const newId = this.activatedRoute.snapshot.params.id;
                this.indexNum = this.activatedRoute.snapshot.params.index;
                this.getSnippet(newId);
            });
        this.getSnippet(id);
    }

    public ngOnDestroy() {
        this.routerEvents.unsubscribe();
    }

    public getSnippet(id) {
        this.sharesService.getShareById(id)
            .subscribe((share: Share[]) => {
                this.share = share[0];
                console.log('this.share: ', this.share);
                this.getSnippets();
            }, (err) => {
                console.error(err);
            });
    }

    public getSnippets() {
        this.sharesService.getShares(1000, 0).subscribe(
            (data) => {
                data.sharesList.forEach((item, i) => {
                    if (item._id === this.share._id) {
                        this.prevId = i !== 0 ? data.sharesList[i - 1]._id : '';
                        this.nextId = i !== data.sharesList.length - 1 ? data.sharesList[i + 1]._id : '';
                    }
                });
            },
            (err) => console.error(err)
        );
    }

    public countDown(finishDate) {
        const createdDateVal = moment(Date.now());
        const finishDateVal = moment(finishDate);
        const duration = moment.duration(createdDateVal.diff(finishDateVal));
        return Math.ceil(duration.asDays() * -1);
    }

    public setFlatData(flat) {
        this.selectFlat = {
            house: flat.house,
            number: flat.number,
            space: flat.space,
            room: (flat.room === 'Студия') ? '0' : (flat.room === 'Однокомнатная') ? '1' : (flat.room === 'Двухкомнатная') ? '2' : '3',
            price: +flat.price - +flat.discount
        };
    }

    public getDiscount(flat): number {
        if (flat.discountType === ShareFlatDiscountType.PERCENT) {
            const discount = +flat.price * (+flat.discount / 100);
            return +discount.toFixed(2);
        }
        return +flat.discount;
    }
}
