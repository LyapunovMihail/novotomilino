import { IFlatWithDiscount } from '../../../../serv-files/serv-modules/addresses-api/addresses.config';
import { IAddressItemFlat } from '../../../../serv-files/serv-modules/addresses-api/addresses.interfaces';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FlatsDiscountService } from '../../commons/flats-discount.service';
import { WindowScrollLocker } from '../../commons/window-scroll-block';
import { FavoritesService } from '../../favorites/favorites.service';

@Component({
    selector: 'app-search-output',
    templateUrl: './search-output.component.html',
    styleUrls: ['./search-output.component.scss'],
    providers: [
        WindowScrollLocker
    ]
})

export class SearchOutputComponent implements OnChanges {

    @Input() public flatsList: IFlatWithDiscount[] = [];
    public isReserveFormOpen: boolean = false;
    public showApartmentWindow = false;
    public selectedFlatIndex: number;

    public selectFlat = {
        house: '0',
        number: '0',
        space: '0',
        room: '0',
        price: 0
    };

    constructor(
        public windowScrollLocker: WindowScrollLocker,
        private flatsDiscountService: FlatsDiscountService,
        private favoritesService: FavoritesService) {
    }

    public ngOnChanges(changes: SimpleChanges) {
        if ('flatsList' in changes) {
            this.flatsList.map((flat) => {
                flat.discount = this.getDiscount(flat);
                flat.inFavorite = this.inFavorite(flat);
                return flat;
            });
        }
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
        return this.flatsDiscountService.getDiscount(flat);
    }

    public inFavorite(flat): boolean {
        return this.favoritesService.inFavorite(flat);
    }

    public openApartmentModal(index) {
        this.selectedFlatIndex = index;
        this.windowScrollLocker.block();
        this.showApartmentWindow = true;
    }
}
