import { IAddressItemFlat } from '../../../../../serv-files/serv-modules/addresses-api/addresses.config';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Share, ShareBodyBlock, ShareFlat, ShareFlatDiscountType } from '../../../../../serv-files/serv-modules/shares-api/shares.interfaces';
import { SharesService } from '../../../news-shares/shares/shares.service';

@Component({
    selector: 'app-search-output',
    templateUrl: './search-output.component.html',
    styleUrls: ['./search-output.component.scss']
})

export class SearchOutputComponent implements OnInit, OnChanges {

    public shareFLats: ShareFlat[] = [];
    @Input() public flatsList: IAddressItemFlat[] = [];

    constructor(
        private sharesService: SharesService
    ) {}

    ngOnInit() {

    }

    public flatsCount() {
        return this.flatsList.length;
    }

    public ngOnChanges(changes: SimpleChanges) {
        if ('flatsList' in changes && changes.flatsList.currentValue.length) {
            this.getShares();
        }
    }

    public getShares() {
        this.sharesService.getShares(100, 0).subscribe((data: {length: number, sharesList: Share[]}) => {
            data.sharesList.forEach((share: Share) => {
                share.body.forEach((block: ShareBodyBlock) => {
                    if (block.blockType === 'flats') {
                        this.shareFLats = [...this.shareFLats, ...block.blockFlats];
                    }
                });
            });
        }, (err) => {
            console.log(err);
        });
    }

    public getDiscount(flat): number {
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
