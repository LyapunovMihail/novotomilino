import { IFlatWithDiscount } from '../../../../../serv-files/serv-modules/addresses-api/addresses.config';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FlatsDiscountService } from '../../../commons/flats-discount.service';
import { WindowScrollLocker } from '../../../commons/window-scroll-block';
import { FavoritesService } from '../../../favorites/favorites.service';
import { SearchService } from '../search.service';

@Component({
    selector: 'app-search-output',
    templateUrl: './search-output.component.html',
    styleUrls: ['./search-output.component.scss'],
    providers: [ WindowScrollLocker ]
})

export class SearchOutputComponent implements OnInit {

    public sort = 'price_1_block';
    public viewType = 'block';
    public selectedFlatIndex: number;
    public showApartmentWindow = false;

    @Input() public count: number;
    @Input() public preloader: boolean;
    @Input() public parentPlan: boolean;
    @Input() public flatsList: IFlatWithDiscount[] = [];

    @Output() public sortChange: EventEmitter<any> = new EventEmitter();

    constructor(
        private searchService: SearchService,
        public favoritesService: FavoritesService,
        public windowScrollLocker: WindowScrollLocker,
        private flatsDiscountService: FlatsDiscountService,
    ) {}

    public ngOnInit() {
        this.preloader = true;
        this.searchService.getOutputFlatsChanged()
            .subscribe((flats: IFlatWithDiscount[]) => {
                this.flatsList = flats;
                this.flatsList.forEach((flat) => {
                    flat.discount = this.getDiscount(flat);
                    flat.inFavorite = this.inFavorite(flat);
                });
                this.preloader = false;
            });
    }

    public flatsCount() {
        return this.count;
    }

    public getDiscount(flat): number {
        return this.flatsDiscountService.getDiscount(flat);
    }

    public setFavorite(flat): void {
        flat.inFavorite = !flat.inFavorite;
        this.favoritesService.setFavorite(flat);
    }
    public inFavorite(flat): boolean {
        return this.favoritesService.inFavorite(flat);
    }

    public openApartmentModal(index) {
        this.selectedFlatIndex = index;
        this.windowScrollLocker.block();
        this.showApartmentWindow = true;
    }

    public parseText(num) {

        num = Math.abs(num) % 100;
        const words = ['квартира', 'квартиры', 'квартир'];
        const sum = num % 10;

        if (num > 10 && num < 20) { return words[2]; }
        if (sum > 1 && sum < 5) { return words[1]; }
        if (sum === 1) { return words[0]; }
        return words[2];
    }
    public sortFlats(sort) {
        const name = (sort.split('_'))[0];
        const value = (sort.split('_'))[1];
        this.viewType = (sort.split('_'))[2];
        this.sortChange.emit(`${name}_${value}`);
    }
}
