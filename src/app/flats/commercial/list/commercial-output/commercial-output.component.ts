import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WindowScrollLocker } from '../../../../commons/window-scroll-block';
import { FavoritesService } from '../../../../favorites/favorites.service';

@Component({
    selector: 'app-commercial-output',
    templateUrl: 'commercial-output.component.html',
    styleUrls: ['./commercial-output.component.scss'],
    providers: [
        WindowScrollLocker
    ]
})

export class CommercialOutputComponent implements OnInit {

    public showApartmentWindow = false;
    public selectedFlatIndex: number;
    public selectFilterItem;
    public selectFilter;
    public sortList = [
        { name: 'space', text: 'По площади', value: false },
        { name: 'priceBySpace', text: 'По цене за 1 м²', value: false },
        { name: 'price', text: 'По цене', value: false },
    ];

    @Input() public flatsList = [];
    @Input() public count: number = 0;
    @Output() public sortChange = new EventEmitter<any>();

    constructor(
        public windowScrollLocker: WindowScrollLocker,
        public favoritesService: FavoritesService,
        private activatedRouter: ActivatedRoute,
        private router: Router,
    ) { }

    ngOnInit() { }

    public parseText(num) {

        num = Math.abs(num) % 100;
        const words = ['помещение', 'помещения', 'помещений'];
        const sum = num % 10;

        if (num > 10 && num < 20) { return words[2]; }
        if (sum > 1 && sum < 5) { return words[1]; }
        if (sum === 1) { return words[0]; }
        return words[2];
    }

    public filter(item) {
        if (this.selectFilterItem) {

            if (this.selectFilterItem === item) {
                this.selectFilter = !this.selectFilter;
            } else {
                this.selectFilterItem = item;
                this.selectFilter = true;
            }
        } else {
            this.selectFilterItem = item;
            this.selectFilter = true;
        }
        this.sortChange.emit({value: item.name, shift: (this.selectFilter ? 1 : -1)});
    }

    public openApartmentModal(index) {
        this.selectedFlatIndex = index;
        this.windowScrollLocker.block();
        this.showApartmentWindow = true;
    }
    public flatNavigate(flat) {
        sessionStorage.setItem('ntm-prev-route', JSON.stringify({ route: this.router.url.split('?')[0], params: this.activatedRouter.snapshot.queryParams }));
        this.router.navigate([`/flats/house/${flat.house}/section/${flat.section}/floor/${flat.floor}/flat/${flat.flat}`]);
    }

    public setFavorite(flat): void {
        flat.inFavorite = !flat.inFavorite;
        this.favoritesService.setFavorite(flat);
    }
    public inFavorite(flat): boolean {
        return this.favoritesService.inFavorite(flat);
    }
}
