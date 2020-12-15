import { Component, OnInit } from '@angular/core';
import { FavoritesService } from './favorites.service';
import { SearchService } from '../flats/search/search.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-favorites',
    templateUrl: './favorites.component.html',
    styleUrls: ['./favorites.component.scss'],
    providers: [ SearchService ]
})
export class FavoritesComponent implements OnInit {

    public sort = 'price_1';
    public viewType: 'block' | 'inline' = 'block';

    constructor(
        public favoritesService: FavoritesService,
        private searchService: SearchService,
        private router: Router,
    ) { }

    public get page() { return this.router.url.split('/').pop(); }
    public get favoriteFlats() { return this.favoritesService.favoriteFlats; }
    public get favoritesTitle() {
        return this.favoritesService.favoriteFlats && this.favoritesService.favoriteFlats.length
            ? 'В избранном ' + this.favoritesService.favoriteFlats.length + ' ' + this.parseText(this.favoritesService.favoriteFlats.length)
            : 'На данный момент в избранное ничего не добавлено';
    }
    public get flatListLength() {
        return this.page === 'flats'
            ? this.favoriteFlats.filter(flat => flat.type === 'КВ').length
            : this.favoriteFlats.filter(flat => flat.type === 'КН').length;
    }

    ngOnInit() {
        this.favoritesService.viewTypeValue.subscribe(value => {
            this.viewType = value;
        });
        setTimeout(() => this.changeSort(), 500);
    }

    public changeSort() {
        const name = this.sort.split('_')[0];
        const value = this.sort.split('_')[1];
        this.favoritesService.viewTypeValue = this.sort.split('_')[2] || 'block';
        this.sort = `${name}_${value}`;
        this.searchService.sortFlats(this.sort, this.favoriteFlats);
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
}
