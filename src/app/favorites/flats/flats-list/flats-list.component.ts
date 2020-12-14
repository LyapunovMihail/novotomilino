import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IFlatWithDiscount } from '../../../../../serv-files/serv-modules/addresses-api/addresses.interfaces';
import { WindowScrollLocker } from '../../../commons/window-scroll-block';
import { FavoritesService } from '../../favorites.service';

@Component({
    selector: 'app-flats-list',
    templateUrl: './flats-list.component.html',
    styleUrls: ['./flats-list.component.scss'],
    providers: [
        WindowScrollLocker
    ]
})
export class FlatsListComponent implements OnInit {

    @Input() public flatsList: IFlatWithDiscount[] = [];

    public showApartmentWindow = false;
    public selectedFlatIndex: number;

    constructor(
        public windowScrollLocker: WindowScrollLocker,
        public favoritesService: FavoritesService,
        private router: Router,
    ) {
    }

    ngOnInit() {
    }

    public openApartmentModal(flat) {
        sessionStorage.setItem('ntm-prev-route', JSON.stringify({ route: this.router.url.split('?')[0] }));
        this.router.navigate([`/flats/house/${flat.house}/section/${flat.section}/floor/${flat.floor}/flat/${flat.flat}`]);
    }
    public setFavorite(flat): void {
        flat.inFavorite = !flat.inFavorite;
        this.favoritesService.setFavorite(flat);
    }
}
