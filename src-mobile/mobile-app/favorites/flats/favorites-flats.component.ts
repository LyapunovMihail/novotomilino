import { Component, OnInit } from '@angular/core';
import { FavoritesService } from '../favorites.service';

@Component({
    selector: 'app-favorites-flats',
    templateUrl: 'favorites-flats.component.html',
    styleUrls: ['../favorites.component.scss'],
})

export class FavoritesFlatsComponent implements OnInit {

    constructor(
        public favoritesService: FavoritesService,
    ) { }

    public get favoriteFlats() {
        return this.favoritesService.favoriteFlats
            ? this.favoritesService.favoriteFlats.filter(flat => flat.type === 'КВ')
            : [];
    }

    ngOnInit() { }
}
