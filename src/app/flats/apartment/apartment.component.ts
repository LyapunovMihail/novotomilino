import { FlatsDiscountService } from '../../commons/flats-discount.service';
import { FavoritesService } from '../../commons/favorites.service';
import { Router } from '@angular/router';
import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { IFlatWithDiscount } from '../../../../serv-files/serv-modules/addresses-api/addresses.interfaces';
import { SearchService } from '../search/search.service';

@Component({
    selector: 'app-flats-apartment-modal',
    templateUrl: './apartment.component.html',
    styleUrls: ['./apartment.component.scss', '../flats.component.scss'],
    providers: [ SearchService ]
})

export class ApartmentComponent implements OnInit {

    public isCreditFormOpen: boolean = false;
    public isReserveFormOpen: boolean = false;
    public flatData: IFlatWithDiscount;
    public pdfLink: string;

    @Input() public showApartmentWindow = false;
    @Input() public flatIndex: number;
    @Input() public flatsList: IFlatWithDiscount[];
    @Output() public close: EventEmitter<boolean> = new EventEmitter();

    constructor(
        public router: Router,
        private flatsDiscountService: FlatsDiscountService,
        private favoritesService: FavoritesService,
        public searchService: SearchService,
    ) {}

    public ngOnInit() {
        this.flatData = this.flatsList[this.flatIndex];
        this.flatData.discount = this.getDiscount(this.flatData);
        this.pdfLink = `/api/pdf?id=${this.flatData['_id']}`;
    }

    public prevFlat() {
        this.flatData = this.flatsList[--this.flatIndex];
        this.flatData.discount = this.getDiscount(this.flatData);
    }

    public nextFlat() {
        this.flatData = this.flatsList[++this.flatIndex];
        this.flatData.discount = this.getDiscount(this.flatData);
    }

    public routePDF() {
        // this.searchService.getPDF(this.flatData['_id']).subscribe(
        //     data => console.log('PDF', data)
        // );
        this.router.navigate(['/pdf'], { queryParams: { id: this.flatData['_id'] } });
    }

    public getDiscount(flat): number {
        return this.flatsDiscountService.getDiscount(flat);
    }

    public minCredit(price) {
        let minPrice = (price / 100 * 5);
        if (this.flatData.discount) {
            minPrice = (price - this.flatData.discount) / 100 * 5;
        }
        return minPrice;
    }

    public toFavorite(): void {
        this.favoritesService.toFavorite(this.flatData);
    }

    get inFavorite(): boolean {
        return this.favoritesService.inFavorite(this.flatData);
    }

}
