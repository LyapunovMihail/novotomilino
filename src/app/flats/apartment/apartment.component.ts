import { FlatsDiscountService } from '../../commons/flats-discount.service';
import { Router } from '@angular/router';
import { Component, Output, EventEmitter, Input, OnInit, OnDestroy } from '@angular/core';
import { IFlatWithDiscount } from '../../../../serv-files/serv-modules/addresses-api/addresses.interfaces';
import { FavoritesService } from '../../favorites/favorites.service';
import { PlatformDetectService } from '../../platform-detect.service';
import { SearchService } from '../search/search.service';
import { SearchFlatsLinkHandlerService } from '../../commons/searchFlatsLinkHandler.service';

@Component({
    selector: 'app-flats-apartment',
    templateUrl: './apartment.component.html',
    styleUrls: ['./apartment.component.scss', '../flats.component.scss'],
    providers: [ SearchService ]
})

export class ApartmentComponent implements OnInit, OnDestroy {

    public isCreditFormOpen = false;
    public isReserveFormOpen = false;
    public isFormSuccessOpen = false;
    public flatData: IFlatWithDiscount;
    public pdfLink: string;
    public clickedPdf = false;
    public changeFlatData;

    constructor(
        private searchFlatsLinkHandlerService: SearchFlatsLinkHandlerService,
        private platformDetectService: PlatformDetectService,
        private flatsDiscountService: FlatsDiscountService,
        private favoritesService: FavoritesService,
        public searchService: SearchService,
        public router: Router,
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
        return `/assets/floor-plans/house_${this.flatData.house}/section_${this.flatData.section}/floor_${this.flatData.floor}/${this.flatData.floor}floor_${this.flatData.flat}${this.typeApartment}.svg`;
    }

    ngOnInit() {
        this.getFlatData();
    }
    ngOnDestroy() {
        sessionStorage.removeItem('ntm-prev-route');
    }

    private getFlatData() {
        this.searchService.getFlatData(this.router.url).subscribe( (data: IFlatWithDiscount) => {
            this.flatData = data;
            this.flatData.discount = this.getDiscount(data);
            // console.log('flatData -> ', data);
        });
    }

    public previousRoute() {
        const prevRoute = JSON.parse(sessionStorage.getItem('ntm-prev-route'));
        if (prevRoute.route === '/flats/plan') {
            this.searchFlatsLinkHandlerService.linkHandle(true, prevRoute.params);
            return;
        }
        this.router.navigate([prevRoute.route || '/flats'], { queryParams: prevRoute.params });
    }
    public routePDF() {
        if (!this.platformDetectService.isBrowser) { return; }

        this.clickedPdf = true;
        const location = window.location.href;
        const modeIndex = location.indexOf('localhost') >= 0 ? 'dev' : 'prod';

        if (this.pdfLink && this.pdfLink.length > 0 && this.changeFlatData === this.flatData) {
            this.clickedPdf = false;
            window.open(this.pdfLink);
            return 'javascript:void(0)';
        }
        this.changeFlatData = this.flatData;

        return this.searchService.getPDF(this.flatData._id, modeIndex).subscribe(
            data => {
                this.pdfLink = data.toString();
                window.open(data.toString());
                this.clickedPdf = false;
                return 'javascript:void(0)';
            },
            err => {
                this.clickedPdf = false;
                return 'javascript:void(0)';
            }
        );
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
