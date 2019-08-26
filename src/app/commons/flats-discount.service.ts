import { Share, ShareBodyBlock, ShareFlat, ShareFlatDiscountType } from '../../../serv-files/serv-modules/shares-api/shares.interfaces';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class FlatsDiscountService {

    public shareFLats: ShareFlat[] = [];
    public shareFLatsLoaded = false;

    constructor(
        private http: HttpClient,
    ) {}

    public getShares() {
        if (!this.shareFLatsLoaded) {
            this.http.get<{ length: number, sharesList: Share[] }>(`/api/shares/list?limit=${100}&skip=${0}`)
                .subscribe((data: { length: number, sharesList: Share[] }) => {
                    data.sharesList.forEach((share: Share) => {
                        share.body.forEach((block: ShareBodyBlock) => {
                            if (block.blockType === 'flats') {
                                this.shareFLats = [...this.shareFLats, ...block.blockFlats];
                                this.shareFLatsLoaded = true;
                            }
                        });
                    });
                }, (err) => {
                    console.log(err);
                });
        }
    }

    public getDiscount(flat): number {
        if (!this.shareFLatsLoaded) { this.getShares(); }

        const shareFlat = this.shareFLats.find((sFlat) => +sFlat.number === flat.flat);

        if (shareFlat) {
            if (shareFlat.discountType === ShareFlatDiscountType.PERCENT) {
                const discount = +shareFlat.price * (+shareFlat.discount / 100);
                return +discount.toFixed(2);
            }
            return +shareFlat.discount;
        }
        return null;
    }
}
