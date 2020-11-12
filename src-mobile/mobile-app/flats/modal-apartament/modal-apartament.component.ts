import { FlatsDiscountService } from '../../commons/flats-discount.service';
import { Router } from '@angular/router';
import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { IFlatWithDiscount } from '../../../../serv-files/serv-modules/addresses-api/addresses.interfaces';
import { FavoritesService } from '../../favorites/favorites.service';

@Component({
    selector: 'app-modal-apartment',
    templateUrl: 'modal-apartament.component.html',
    styleUrls: ['modal-apartament.component.scss']
})

export class ModalApartamentComponent implements OnInit {
    public isCreditFormOpen = false;
    public isReserveFormOpen = false;
    public isformSuccessOpen = false;
    public flatData: IFlatWithDiscount;
    public pdfLink: string;

    public isCreditFormSubmit = false;
    public isReserveFormSubmit = false;

    @Input() public showApartmentWindow = false;
    @Input() public flatIndex: number;
    @Input() public flatType = 'flat';
    @Input() public flatsList: IFlatWithDiscount[];
    @Output() public close: EventEmitter<boolean> = new EventEmitter();

    constructor(
        public router: Router,
        private flatsDiscountService: FlatsDiscountService,
        private favoritesService: FavoritesService,
    ) {}

    public get apartamentRooms() {
        return this.flatType === 'flat'
            ? this.flatData.rooms < 1
                ? 'Студия'
                : this.flatData.rooms + ' комнатная'
            : 'Помещение';
    }
    public get imageSrc() {
        return `/assets/floor-plans/house_${this.flatData.house}/section_${this.flatData.section}/floor_${this.flatData.floor}/${this.flatData.floor}floor_${this.flatData.flat}${this.flatType}.svg`;
    }

    public ngOnInit() {
        this.flatData = this.flatsList[this.flatIndex];
        this.flatData.discount = this.getDiscount(this.flatData);
        this.pdfLink = `/api/pdf?id=${this.flatData._id}`;
    }

    public prevFlat() {
        this.flatData = this.flatsList[--this.flatIndex];
        this.flatData.discount = this.getDiscount(this.flatData);
        this.isCreditFormSubmit = false;
        this.isReserveFormSubmit = false;
    }

    public nextFlat() {
        this.flatData = this.flatsList[++this.flatIndex];
        this.flatData.discount = this.getDiscount(this.flatData);
        this.isCreditFormSubmit = false;
        this.isReserveFormSubmit = false;
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

    public setFavorite(): void {
        this.flatData.inFavorite = !this.flatData.inFavorite;
        this.favoritesService.setFavorite(this.flatData);
    }
}
