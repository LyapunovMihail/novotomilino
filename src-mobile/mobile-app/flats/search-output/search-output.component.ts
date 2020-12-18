import { IFlatWithDiscount } from '../../../../serv-files/serv-modules/addresses-api/addresses.config';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FlatsDiscountService } from '../../commons/flats-discount.service';
import { WindowScrollLocker } from '../../commons/window-scroll-block';
import { FavoritesService } from '../../favorites/favorites.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-search-output',
    templateUrl: './search-output.component.html',
    styleUrls: ['./search-output.component.scss'],
    providers: [
        WindowScrollLocker
    ]
})

export class SearchOutputComponent implements OnChanges {

    public selectedFlatIndex: number;
    public isReserveFormOpen = false;
    public showApartmentWindow = false;
    public favoriteNotice: boolean;

    @Input() public flatsCount: number;
    @Input() public viewType: 'block' | 'inline';
    @Input() public flatsList: IFlatWithDiscount[] = [];
    @Output() public closeFavoriteNotice: EventEmitter<any> = new EventEmitter();

    public selectFlat = {
        house: '0',
        number: '0',
        space: '0',
        room: '0',
        price: 0
    };

    constructor(
        public windowScrollLocker: WindowScrollLocker,
        private flatsDiscountService: FlatsDiscountService,
        private favoritesService: FavoritesService,
        private activatedRouter: ActivatedRoute,
        private router: Router,
    ) { }

    public get favoriteSnippet() {
        return this.flatsCount <= 12 && this.favoriteNotice && this.viewType === 'block';
    }

    public ngOnChanges(changes: SimpleChanges) {
        if ('flatsList' in changes && this.flatsList && this.flatsList.length) {
            this.flatsList.map((flat) => {
                flat.discount = this.getDiscount(flat);
                return flat;
            });
        }
        if ('viewType' in changes) {
            this.favoriteNotice = sessionStorage.getItem('ntm-favorite-notice')
                ? JSON.parse(sessionStorage.getItem('ntm-favorite-notice')).show
                : true;
        }
    }

    public setFlatData(flat) {
        this.selectFlat = {
            house: flat.house,
            number: flat.number,
            space: flat.space,
            room: (flat.room === 'Студия') ? '0' : (flat.room === 'Однокомнатная') ? '1' : (flat.room === 'Двухкомнатная') ? '2' : '3',
            price: +flat.price - +flat.discount
        };
    }


    public getDiscount(flat): number {
        return this.flatsDiscountService.getDiscount(flat);
    }

    public inFavorite(flat): boolean {
        return this.favoritesService.inFavorite(flat);
    }

    public openApartmentModal(flat) {
        sessionStorage.setItem('ntm-prev-route', JSON.stringify({ route: this.router.url.split('?')[0], params: this.activatedRouter.snapshot.queryParams }));
        this.router.navigate([`/flats/house/${flat.house}/section/${flat.section}/floor/${flat.floor}/flat/${flat.flat}`]);
    }
    public noticeFavorite() {
        this.closeFavoriteNotice.emit();
    }
}
