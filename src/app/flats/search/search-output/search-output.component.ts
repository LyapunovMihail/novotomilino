import { IFlatWithDiscount } from '../../../../../serv-files/serv-modules/addresses-api/addresses.config';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FlatsDiscountService } from '../../../commons/flats-discount.service';

@Component({
    selector: 'app-search-output',
    templateUrl: './search-output.component.html',
    styleUrls: ['./search-output.component.scss']
})

export class SearchOutputComponent implements OnChanges {

    @Input() public flatsList: IFlatWithDiscount[] = [];

    constructor(
        private flatsDiscountService: FlatsDiscountService
    ) {}

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.flatsList.currentValue.length) {
            this.flatsList.map((flat) => {
                flat.discount = this.getDiscount(flat);
                return flat;
            });
        }
    }

    public flatsCount() {
        return this.flatsList.length;
    }

    public getDiscount(flat): number {
        return this.flatsDiscountService.getDiscount(flat);
    }
}
