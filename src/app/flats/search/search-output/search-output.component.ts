import { IFlatWithDiscount } from '../../../../../serv-files/serv-modules/addresses-api/addresses.config';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FlatsDiscountService } from '../../../commons/flats-discount.service';
import { WindowScrollLocker } from '../../../commons/window-scroll-block';
import { FavoritesService } from '../../../favorites/favorites.service';
import { SearchService } from '../search.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-search-output',
    templateUrl: './search-output.component.html',
    styleUrls: ['./search-output.component.scss'],
    providers: [ WindowScrollLocker ]
})

export class SearchOutputComponent implements OnInit {

    public sort = 'price_1_block';
    public viewType = 'block';
    public selectedFlatIndex: number;
    public showApartmentWindow = false;
    public showFavoriteWindow = true;

    @Input() public count: number;
    @Input() public preloader: boolean;
    @Input() public parentPlan: boolean;
    @Input() public flatsList: IFlatWithDiscount[] = [];

    @Output() public sortChange: EventEmitter<any> = new EventEmitter();
    @Output() public closeFavoriteNotice: EventEmitter<any> = new EventEmitter();

    constructor(
        private searchService: SearchService,
        public favoritesService: FavoritesService,
        public windowScrollLocker: WindowScrollLocker,
        private flatsDiscountService: FlatsDiscountService,
        private activatedRouter: ActivatedRoute,
        private router: Router,
    ) {}

    public ngOnInit() {
        this.preloader = true;
        this.showFavoriteWindow = sessionStorage.getItem('ntm-favorite-notice')
            ? JSON.parse(sessionStorage.getItem('ntm-favorite-notice')).show
            : true;
        this.searchService.getOutputFlatsChanged()
            .subscribe((flats: IFlatWithDiscount[]) => {
                this.flatsList = flats;
                this.flatsList.forEach((flat) => {
                    flat.discount = this.getDiscount(flat);
                    flat.inFavorite = this.inFavorite(flat);
                });
                this.preloader = false;
            });
    }

    public flatsCount() {
        return this.count;
    }

    public getDiscount(flat): number {
        return this.flatsDiscountService.getDiscount(flat);
    }

    public setFavorite(flat): void {
        flat.inFavorite = !flat.inFavorite;
        this.favoritesService.setFavorite(flat);
    }
    public inFavorite(flat): boolean {
        return this.favoritesService.inFavorite(flat);
    }

    public flatNavigate(flat) {
        sessionStorage.setItem('ntm-prev-route', JSON.stringify({ route: this.router.url.split('?')[0], params: this.activatedRouter.snapshot.queryParams }));
        this.router.navigate([`/flats/house/${flat.house}/section/${flat.section}/floor/${flat.floor}/flat/${flat.flat}`]);
    }

    public parseText(num) {

        num = Math.abs(num) % 100;
        const words = ['квартира', 'квартиры', 'квартир'];
        const sum = num % 10;

        if (num > 10 && num < 20) { return words[2]; }
        if (sum > 1 && sum < 5) { return words[1]; }
        if (sum === 1) { return words[0]; }
        return words[2];
    }
    public sortFlats(sort) {
        const name = (sort.split('_'))[0];
        const value = (sort.split('_'))[1];
        this.viewType = (sort.split('_'))[2];
        this.sortChange.emit(`${name}_${value}`);
    }

    public noticeFavorite() {
        this.showFavoriteWindow = !this.showFavoriteWindow;
        sessionStorage.setItem('ntm-favorite-notice', JSON.stringify({ show: false }));
        this.closeFavoriteNotice.emit();
    }
}
