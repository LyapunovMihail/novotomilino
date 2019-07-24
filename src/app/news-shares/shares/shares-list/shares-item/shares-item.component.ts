import { ActivatedRoute } from '@angular/router';
import { Share, SHARES_UPLOADS_PATH, ShareFlatDiscountType } from '../../../../../../serv-files/serv-modules/shares-api/shares.interfaces';
import { SharesService } from '../../shares.service';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { WindowScrollLocker } from '../../../../commons/window-scroll-block';

@Component({
    selector: 'app-shares-item',
    templateUrl: './shares-item.component.html',
    styleUrls: ['./shares-item.component.scss'],
    providers: [
        WindowScrollLocker
    ]
})
export class SharesItemComponent implements OnInit {

    public isReserveFormOpen: boolean = false;
    public isCallFormOpen: boolean = false;

    // public share: Share;
    public share;

    public shareId: string;

    public uploadsPath: string = `/${SHARES_UPLOADS_PATH}`;

    public shareFlatDiscountType = ShareFlatDiscountType;

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
        private activatedRoute: ActivatedRoute
    ) {
        this.shareId = this.activatedRoute.snapshot.params['id'];
    }

    public ngOnInit() {
        this.sharesService.getShareById(this.shareId)
            .subscribe((share: Share[]) => {
                this.share = share[0];
            }, (err) => {
                console.error(err);
            });
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
