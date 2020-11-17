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

    public flatList;
    public activeSort: string;
    public sortValue: string;
    public sortList: any = {
        flats: [
            { name: 'price', text: 'По цене', value: false },
            { name: 'space', text: 'По площади', value: false },
            { name: 'floor', text: 'По этажу', value: false },
            // { name: 'delivery', text: 'По сроку сдачи', value: false },
        ],
        commercial: [
            { name: 'price', text: 'По цене', value: false },
            { name: 'space', text: 'По площади', value: false },
            { name: 'priceBySpace', text: 'По цене за 1 м²', value: false },
        ]
    };

    constructor(
        public favoritesService: FavoritesService,
        private searchService: SearchService,
        private router: Router,
    ) { }

    public get favoriteFlats() { return this.favoritesService.favoriteFlats; }
    public get favoritesTitle() {
        return this.favoritesService.favoriteFlats && this.favoritesService.favoriteFlats.length
            ? 'В избранном ' + this.favoritesService.favoriteFlats.length + ' ' + this.parseText(this.favoritesService.favoriteFlats.length)
            : 'На данный момент в избранное ничего не добавлено';
    }
    public get filterListByUrl() {
        return this.sortList[this.router.url.split('/').pop()];
    }

    ngOnInit() { }

    public changeFilter(item, i) {
        this.filterListByUrl[i].value = this.activeSort === item.name ? !item.value : true;
        this.activeSort = item.name;
        this.sortValue = `${this.activeSort}_${(this.filterListByUrl[i].value ? '1' : '0')}`;
        if (item.name === 'priceBySpace' ) {
            this.sortCommercial(item.name, this.filterListByUrl[i].value);
            return;
        }

        this.sortFlats();
    }
    public sortFlats() {
        this.searchService.sortFlats(this.sortValue, this.favoriteFlats);
    }
    private sortCommercial(val, shift) {
        this.favoriteFlats.sort((a,b) => {
            if (val === 'priceBySpace') {
                if (!shift) {
                    return (a.price / a.space) - (b.price / b.space);
                } else {
                    return (b.price / b.space) - (a.price / a.space);
                }
            } else {
                if (!shift) {
                    return a[val] - b[val];
                } else {
                    return b[val] - a[val];
                }
            }
        });
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

    public gateGuard(mod) {
        const page = this.router.url.split('/').pop();
        if (mod === page) { return; }
        this.activeSort = '';
        this.sortValue = '';
        // tslint:disable-next-line: forin
        for (const key in this.sortList) {
            this.sortList[key].forEach(filter => {
                filter.value = false;
            });
        }
    }
}
