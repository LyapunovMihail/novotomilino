import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IFlatWithDiscount } from '../../../../../serv-files/serv-modules/addresses-api/addresses.interfaces';
import { FavoritesService } from '../../../favorites/favorites.service';

@Component({
    selector: 'app-flat-snippet-block',
    templateUrl: 'flat-snippet-block.component.html',
    styleUrls: ['./flat-snippet-block.component.scss']
})

export class FlatSnippetBlockComponent implements OnInit {

    @Input() public index: number;
    @Input() public isFirst: boolean;
    @Input() public flatsCount: number;
    @Input() public flatData: IFlatWithDiscount;

    constructor(
        public favoritesService: FavoritesService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
    ) { }

    // tslint:disable-next-line: max-line-length
    public get svgPath() { return `/assets/floor-plans/house_${this.flatData.house}/section_${this.flatData.section}/floor_${this.flatData.floor}/${this.flatData.floor}floor_${this.flatData.flat}flat.svg`; }
    // tslint:disable-next-line: max-line-length
    public get statusNotSale() { return this.flatData.status === '1' ? 'Квартира пока не в продаже. Вы можете забронировать ее на индивидуальных условиях, связавшись с менеджером отдела продаж' : ''; }
    public get isEuro() { return this.flatData.isEuro === '1'; }
    public get showFavoriteNotice() {
        return this.isFirst && this.flatsCount > 12;
    }

    ngOnInit() { }

    public setFavorite(): void {
        this.flatData.inFavorite = !this.flatData.inFavorite;
        this.favoritesService.setFavorite(this.flatData);
    }
    public goToFlat() {
        sessionStorage.setItem('ntm-prev-route', JSON.stringify({ route: this.router.url.split('?')[0], params: this.activatedRoute.snapshot.queryParams }));
        this.router.navigate([`/flats/house/${this.flatData.house}/section/${this.flatData.section}/floor/${this.flatData.floor}/flat/${this.flatData.flat}`]);
    }
}
