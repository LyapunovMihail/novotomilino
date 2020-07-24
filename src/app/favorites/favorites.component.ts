import { Component, OnInit } from '@angular/core';
import { FavoritesService } from './favorites.service';
import { SearchService } from '../flats/search/search.service';

@Component({
    selector: 'app-favorites',
    templateUrl: './favorites.component.html',
    styleUrls: ['./favorites.component.scss'],
    providers: [ SearchService ]
})
export class FavoritesComponent implements OnInit {

    public activeSort: string;
    public flatList;
    public sortValue;
    public sortList: any = [
        {
            name: 'price',
            text: 'По цене',
            value: false
        },
        {
            name: 'space',
            text: 'По площади',
            value: false
        },
        {
            name: 'floor',
            text: 'По этажу',
            value: false
        },
        // {
        //     name: 'delivery',
        //     text: 'По сроку сдачи',
        //     value: false
        // }
    ];

    constructor(
        public favoritesService: FavoritesService,
        private searchService: SearchService,
    ) { }

    ngOnInit() { }

    public changeFilter(item, i) {
        this.sortList[i].value = this.activeSort === item.name ? !item.value : true;
        this.sortList.push({ activeIndex: i });
        this.activeSort = item.name;
        this.sortValue = `${this.activeSort}_${(this.sortList[i].value ? '1' : '0')}`;

        this.sortFlats();
    }
    public sortFlats() {
        this.searchService.sortFlats(this.sortValue, this.favoritesService.favoriteFlats);
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
