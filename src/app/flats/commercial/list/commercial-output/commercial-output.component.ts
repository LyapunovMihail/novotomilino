import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WindowScrollLocker } from '../../../../commons/window-scroll-block';
import { FavoritesService } from '../../../../favorites/favorites.service';
import { SearchService } from '../../../search/search.service';

@Component({
    selector: 'app-commercial-output',
    templateUrl: 'commercial-output.component.html',
    styleUrls: ['./commercial-output.component.scss'],
    providers: [
        WindowScrollLocker,
    ]
})

export class CommercialOutputComponent implements OnInit {

    public sort = 'price_1';

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

    public changeSort() {
        const name = this.sort.split('_')[0];
        const value = this.sort.split('_')[1];
        this.favoritesService.viewTypeValue = this.sort.split('_')[2] || 'block';
        this.sort = `${name}_${value}`;
        this.sortChange.emit(this.sort);
    }

    public parseText(num) {

        num = Math.abs(num) % 100;
        const words = ['помещение', 'помещения', 'помещений'];
        const sum = num % 10;

        if (num > 10 && num < 20) { return words[2]; }
        if (sum > 1 && sum < 5) { return words[1]; }
        if (sum === 1) { return words[0]; }
        return words[2];
    }

    public flatNavigate(flat) {
        sessionStorage.setItem('ntm-prev-route', JSON.stringify({ route: this.router.url.split('?')[0], params: this.activatedRouter.snapshot.queryParams }));
        this.router.navigate([`/flats/house/${flat.house}/section/${flat.section}/floor/${flat.floor}/office/${flat.flat}`]);
    }

    public setFavorite(flat): void {
        flat.inFavorite = !flat.inFavorite;
        this.favoritesService.setFavorite(flat);
    }
    public inFavorite(flat): boolean {
        return this.favoritesService.inFavorite(flat);
    }
}
