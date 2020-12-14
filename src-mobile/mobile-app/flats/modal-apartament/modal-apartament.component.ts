import { FlatsDiscountService } from '../../commons/flats-discount.service';
import { Router } from '@angular/router';
import { Component, Output, EventEmitter, Input, OnInit, OnDestroy } from '@angular/core';
import { IFlatWithDiscount } from '../../../../serv-files/serv-modules/addresses-api/addresses.interfaces';
import { FavoritesService } from '../../favorites/favorites.service';
import { FlatsService } from '../flats.service';

@Component({
    selector: 'app-modal-apartment',
    templateUrl: 'modal-apartament.component.html',
    styleUrls: ['modal-apartament.component.scss'],
    providers: [ FlatsService ]
})

export class ModalApartamentComponent implements OnInit, OnDestroy {

    public isCreditFormOpen = false;
    public isReserveFormOpen = false;
    public isformSuccessOpen = false;
    public flatData: IFlatWithDiscount;
    public pdfLink: string;

    public isCreditFormSubmit = false;
    public isReserveFormSubmit = false;

    constructor(
        public router: Router,
        private flatsDiscountService: FlatsDiscountService,
        private favoritesService: FavoritesService,
        private flatsService: FlatsService,
    ) {}

    public get apartamentRooms() {
        return this.typeApartment === 'flat'
            ? this.flatData.rooms < 1
                ? 'Студия'
                : this.flatData.rooms + ' комнатная'
            : 'Помещение';
    }
    public get typeApartment() {
        return this.flatData.type === 'КВ'
            ? 'flat'
            : 'office';
    }
    public get planPath() {
        // tslint:disable-next-line: max-line-length
        return `/assets/floor-plans/house_${this.flatData.house}/section_${this.flatData.section}/floor_${this.flatData.floor}/${this.flatData.floor}floor_${this.flatData.flat}${this.typeApartment}.svg`;
    }

    ngOnInit() {
        this.getFlatData();
    }
    ngOnDestroy() {
        sessionStorage.removeItem('ntm-prev-route');
    }

    private getFlatData() {
        this.flatsService.getFlatData(this.router.url).subscribe( (data: IFlatWithDiscount) => {
            this.flatData = data;
            this.flatData.discount = this.getDiscount(data);
        });
    }
    public previousRoute() {
        const prevRoute = JSON.parse(sessionStorage.getItem('ntm-prev-route'));
        this.router.navigate([prevRoute.route || '/flats'], { queryParams: prevRoute.params });
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
