import { IFlatWithDiscount } from '../../../../../serv-files/serv-modules/addresses-api/addresses.config';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FlatsDiscountService } from '../../../commons/flats-discount.service';
import { WindowScrollLocker } from '../../../commons/window-scroll-block';

@Component({
    selector: 'app-search-output',
    templateUrl: './search-output.component.html',
    styleUrls: ['./search-output.component.scss'],
    providers: [
        WindowScrollLocker
    ]
})

export class SearchOutputComponent implements OnChanges {

    public showApartmentWindow = false;
    public selectedFlatIndex: number;
    @Input() public flatsList: IFlatWithDiscount[] = [];
    @Input() public count: number;

    constructor(
        public windowScrollLocker: WindowScrollLocker,
        private flatsDiscountService: FlatsDiscountService
    ) {}

    public ngOnChanges(changes: SimpleChanges) {
        console.log('flats: ', this.flatsList);
        console.log('count: ', this.count);
        if (changes.flatsList.currentValue.length) {
            this.flatsList.map((flat) => {
                flat.discount = this.getDiscount(flat);
                return flat;
            });
        }
    }

    public flatsCount() {
        return this.count;
    }

    public getDiscount(flat): number {
        return this.flatsDiscountService.getDiscount(flat);
    }

    public openApartmentModal(index) {
        this.selectedFlatIndex = index;
        this.windowScrollLocker.block();
        this.showApartmentWindow = true;
    }
}
