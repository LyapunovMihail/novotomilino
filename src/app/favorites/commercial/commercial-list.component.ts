import { Component, Input, OnInit } from '@angular/core';
import { IFlatWithDiscount } from '../../../../serv-files/serv-modules/addresses-api/addresses.interfaces';
import { WindowScrollLocker } from '../../commons/window-scroll-block';
import { FavoritesService } from '../favorites.service';

@Component({
    selector: 'app-commercial-list',
    templateUrl: 'commercial-list.component.html',
    styleUrls: ['./commercial-list.component.scss'],
    providers: [
        WindowScrollLocker
    ]
})

export class FavoritesCommercialComponent implements OnInit {

    @Input() public flatsList: IFlatWithDiscount[] = [];

    public showApartmentWindow = false;
    public selectedFlatIndex: number;

    constructor(
        public windowScrollLocker: WindowScrollLocker,
        public favoritesService: FavoritesService
    ) { }

    public get favoriteFlats() { return this.favoritesService.favoriteFlats.filter(flat => flat.type === 'КН'); }

    ngOnInit() { }

    public openApartmentModal(index) {
        this.selectedFlatIndex = index;
        this.windowScrollLocker.block();
        this.showApartmentWindow = true;
    }
    public setFavorite(flat): void {
        flat.inFavorite = !flat.inFavorite;
        this.favoritesService.setFavorite(flat);
    }
}
