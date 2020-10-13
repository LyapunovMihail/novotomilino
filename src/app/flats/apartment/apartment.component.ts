import { FlatsDiscountService } from '../../commons/flats-discount.service';
import { Router } from '@angular/router';
import { Component, Output, EventEmitter, Input, OnInit, OnDestroy } from '@angular/core';
import { IFlatWithDiscount } from '../../../../serv-files/serv-modules/addresses-api/addresses.interfaces';
import { FavoritesService } from '../../favorites/favorites.service';
import { PlatformDetectService } from '../../platform-detect.service';
import { SearchService } from '../search/search.service';

@Component({
    selector: 'app-flats-apartment-modal',
    templateUrl: './apartment.component.html',
    styleUrls: ['./apartment.component.scss', '../flats.component.scss'],
    providers: [ SearchService ]
})

export class ApartmentComponent implements OnInit, OnDestroy {

    public isCreditFormOpen = false;
    public isReserveFormOpen = false;
    public isFormConfirmOpen = false;
    public flatData: IFlatWithDiscount;
    public pdfLink: string;
    public clickedPdf = false;
    public changeFlatData;

    @Input() public showApartmentWindow = false;
    @Input() public flatIndex: number;
    @Input() public flatsList: IFlatWithDiscount[];
    @Output() public close: EventEmitter<boolean> = new EventEmitter();

    constructor(
        private platformDetectService: PlatformDetectService,
        public router: Router,
        private flatsDiscountService: FlatsDiscountService,
        private favoritesService: FavoritesService,
        public searchService: SearchService,
    ) {}

    public ngOnInit() {
        this.flatData = this.flatsList[this.flatIndex];
        this.flatData.discount = this.getDiscount(this.flatData);
        // this.pdfLink = `/api/pdf?id=${this.flatData['_id']}`;
        this.hideHeader(true);
        console.log('flatData: ', this.flatData);

    }
    ngOnDestroy() {
        this.hideHeader(false);
    }

    public hideHeader(val) {
        if (this.router.url.startsWith('/flats/house')) { return; }
        const header = (document.querySelector('.header') as HTMLElement);
        const showFilterBtn = (document.querySelector('.search__show-btn') as HTMLElement) || null;
        if (val) {
            header.style.zIndex = '0';
            if (showFilterBtn !== null) { showFilterBtn.style.zIndex = '0'; }
        } else {
            header.style.zIndex = '';
            if (showFilterBtn !== null) { showFilterBtn.style.zIndex = ''; }
        }
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
                console.log(data);
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
