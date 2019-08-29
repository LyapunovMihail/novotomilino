import { FlatsDiscountService } from '../../commons/flats-discount.service';
import { FavoritesService } from '../../commons/favorites.service';
import { FloorCount } from '../floor/floor-count';
import { Router } from '@angular/router';
import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { IFlatWithDiscount } from '../../../../serv-files/serv-modules/addresses-api/addresses.interfaces';

@Component({
    selector: 'app-flats-apartment-modal',
    templateUrl: './apartment.component.html',
    styleUrls: ['./apartment.component.scss', '../flats.component.scss']
})

export class ApartmentComponent implements OnInit {

    public floorCount = FloorCount;

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

    public getDiscount(flat): number {
        return this.flatsDiscountService.getDiscount(flat);
    }

    public toFavorite(): void {
        this.favoritesService.toFavorite(this.flatData);
    }

    get inFavorite(): boolean {
        return this.favoritesService.inFavorite(this.flatData);
    }

}
