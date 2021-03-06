import { Component, OnInit } from '@angular/core';
import { FavoritesService } from '../favorites.service';

@Component({
    selector: 'app-favorites-flats',
    templateUrl: 'favorites-flats.component.html',
    styleUrls: ['../favorites.component.scss'],
})

export class FavoritesFlatsComponent implements OnInit {

    public viewType: 'block' | 'inline' = 'block';

    constructor(
        public favoritesService: FavoritesService,
    ) { }

    public get favoriteFlats() { return this.favoritesService.favoriteFlats.filter(flat => flat.type === 'КВ'); }

    ngOnInit() {
        this.favoritesService.viewTypeValue.subscribe(value => {
            this.viewType = value;
        });
    }
}
