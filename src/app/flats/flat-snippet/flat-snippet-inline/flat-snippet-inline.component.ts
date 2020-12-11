import { Component, Input, OnInit } from '@angular/core';
import { IFlatWithDiscount } from '../../../../../serv-files/serv-modules/addresses-api/addresses.interfaces';
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
        public favoritesService: FavoritesService,
    ) { }

    // tslint:disable-next-line: max-line-length
    public get svgPath() { return `/assets/floor-plans/house_${this.flatData.house}/section_${this.flatData.section}/floor_${this.flatData.floor}/${this.flatData.floor}floor_${this.flatData.flat}flat.svg`; }
    // tslint:disable-next-line: max-line-length
    public get statusNotSale() { return this.flatData.status === '1' ? 'Квартира пока не в продаже. Вы можете забронировать ее на индивидуальных условиях, связавшись с менеджером отдела продаж' : ''; }
    public get isEuro() { return this.flatData.isEuro === '1'; }

    ngOnInit() { }

    public setFavorite(): void {
        this.flatData.inFavorite = !this.flatData.inFavorite;
        this.favoritesService.setFavorite(this.flatData);
    }
}
