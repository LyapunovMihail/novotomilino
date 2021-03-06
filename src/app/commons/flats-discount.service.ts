import { Share, ShareFlat, ShareFlatDiscountType } from '../../../serv-files/serv-modules/shares-api/shares.interfaces';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class FlatsDiscountService {

    public shareFLats: ShareFlat[] = [];
    private filter: Subject<any> = new Subject();

    constructor(
        private http: HttpClient,
    ) {}

    public getShares() {
        this.http.get<{ length: number, sharesList: Share[] }>(`/api/shares/list?limit=${100}&skip=${0}`)
            .subscribe((data: { length: number, sharesList: Share[] }) => {
                this.shareFLats = [];
                data.sharesList.forEach((share: Share) => {
                    this.shareFLats.push(...share.shareFlats);
                });
            }, (err) => {
                console.log(err);
            });
    }

    public getDiscount(flat): number {
        const shareFlat = this.shareFLats.find((sFlat) => {
            if ( sFlat ) {
                return sFlat.flat === flat.flat && sFlat.house === flat.house;
            }
        });

        if (shareFlat) {
            if (shareFlat.discountType === ShareFlatDiscountType.PERCENT) {
                const discount = shareFlat.price * (shareFlat.discountValue / 100);
                return +discount.toFixed(2);
            }
            return shareFlat.discountValue;
        }
        return null;
    }
    setFilterValue(val) {
        this.filter.next(val);
    }
    getFilterValue(): Observable<any> {
        return this.filter.asObservable();
    }
}
