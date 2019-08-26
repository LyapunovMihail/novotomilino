import { IAddressItemFlat } from '../../../../../serv-files/serv-modules/addresses-api/addresses.config';
import { Component, Input } from '@angular/core';
import { FlatsDiscountService } from '../../../commons/flats-discount.service';

@Component({
    selector: 'app-search-output',
    templateUrl: './search-output.component.html',
    styleUrls: ['./search-output.component.scss']
})

export class SearchOutputComponent {

    @Input() public flatsList: IAddressItemFlat[] = [];

    constructor(
        private flatsDiscountService: FlatsDiscountService
    ) {}

    public flatsCount() {
        return this.flatsList.length;
    }

    public getDiscount(flat): number {
        return this.flatsDiscountService.getDiscount(flat);
    }
}
