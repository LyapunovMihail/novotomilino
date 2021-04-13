import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IFlatWithDiscount } from '../../../../../serv-files/serv-modules/addresses-api/addresses.interfaces';
import { FlatsDiscountService } from '../../../commons/flats-discount.service';
import { FavoritesService } from '../../../favorites/favorites.service';

@Component({
    selector: 'app-flat-snippet-inline',
    templateUrl: 'flat-snippet-inline.component.html',
    styleUrls: ['./flat-snippet-inline.component.scss']
})

export class FlatSnippetInlineComponent implements OnInit {

    @Input() public isFirst: boolean;
    @Input() public flatData: IFlatWithDiscount;

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        public favoritesService: FavoritesService,
        private flatsDiscountService: FlatsDiscountService,
    ) { }

    // tslint:disable-next-line: max-line-length
    public get svgPath() { return `/assets/floor-plans/house_${this.flatData.house}/section_${this.flatData.section}/floor_${this.flatData.floor}/${this.flatData.floor}floor_${this.flatData.flat}flat.svg`; }
    // tslint:disable-next-line: max-line-length
    public get statusNotSale() { return this.flatData.status === '1' ? 'Квартира пока не в продаже. Вы можете забронировать ее на индивидуальных условиях, связавшись с менеджером отдела продаж' : ''; }
    public get isEuro() { return this.flatData.isEuro === '1'; }

    ngOnInit() {
        if (!('inFavorite' in this.flatData)) {
            this.flatData.inFavorite = this.inFavorite();
        }
        if (!('discount' in this.flatData)) {
            (this.flatData as IFlatWithDiscount).discount = this.getDiscount();
        }
    }

    public setFavorite(): void {
        this.flatData.inFavorite = !this.flatData.inFavorite;
        this.favoritesService.setFavorite(this.flatData);
    }
    public goToFlat() {
        localStorage.setItem('ntm-prev-route', JSON.stringify({ route: this.router.url.split('?')[0], params: this.activatedRoute.snapshot.queryParams }));
        this.router.navigate([`/flats/house/${this.flatData.house}/section/${this.flatData.section}/floor/${this.flatData.floor}/flat/${this.flatData.flat}`]);
    }

    public inFavorite(): boolean {
        return this.favoritesService.inFavorite(this.flatData);
    }
    public getDiscount(): number {
        return this.flatsDiscountService.getDiscount(this.flatData);
    }
}
