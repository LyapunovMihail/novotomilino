import { Component, Input, OnInit } from '@angular/core';
import { WindowScrollLocker } from '../../../commons/window-scroll-block';
import { FavoritesService } from '../../../favorites/favorites.service';
import { FormConfig } from '../../search-form/search-form.config';
import { CommercialService } from '../commercial.service';

@Component({
    selector: 'app-commercial-list',
    templateUrl: 'commercial-list.component.html',
    styleUrls: ['./commercial-list.component.scss'],
    providers: [
        WindowScrollLocker,
        CommercialService,
    ]
})

export class CommercialListComponent implements OnInit {

    public activeSort: string;
    public sortList = [
        { name: 'price', text: 'По цене', value: false },
        { name: 'space', text: 'По площади', value: false },
        { name: 'priceBySpace', text: 'По цене за 1 м²', value: false },
    ];
    public counter: number;
    public skip: number;
    public params: any;
    public sort: string = FormConfig.sort;
    public outputFlatsList;
    public searchFlats;
    public isLoadMoreBtn = false;
    public selectFilterItem;
    public selectFilter;

    public showFilter: boolean = false;

    constructor(
        public commercialService: CommercialService,
        public windowScrollLocker: WindowScrollLocker,
        public favoritesService: FavoritesService,
    ) { }

    ngOnInit() { }

    public formChange(form) {
        if (!form) { return; }

        const params = {
            type: 'КН',
            spaceMin: form.space.min,
            spaceMax: form.space.max,
            priceMin: form.price.min,
            priceMax: form.price.max,
        };

        if ( 'houses' in form && form.houses.length > 0 ) {
            params['houses'] = (form.houses).join(',');
        }

        this.params = params;
        this.skip = 0;
        this.outputFlatsList = [];

        this.getFlats(params);
    }

    private getFlats(params) {
        this.commercialService.getObjects(params).subscribe(
            data => {
                this.searchFlats = data.filter(item => item.status === '4');
                this.searchFlats.map((flat) => {
                    flat.inFavorite = this.inFavorite(flat);
                    return flat;
                });
                this.counter = this.searchFlats.length;
                this.loadMore();
            },
            (err) => {
                console.log(err);
            }
        );
    }
    private inFavorite(flat): boolean {
        return this.favoritesService.inFavorite(flat);
    }
    public scrollTop() {
        window.scrollTo(0, 0);
    }

    public loadMore() {
        for (let i = 0; i < 10; i++) {
            if (this.skip < this.searchFlats.length) {
                this.outputFlatsList.push(this.searchFlats[this.skip++]);
            }
        }
        this.isLoadMoreBtn = this.skip < this.searchFlats.length;
    }
    public sortFlats(val = 'space', shift = 1) {
        this.searchFlats.sort((a,b) => {
            if (val === 'priceBySpace') {
                if (shift < 0) {
                    return (a.price / a.space) - (b.price / b.space);
                } else {
                    return (b.price / b.space) - (a.price / a.space);
                }
            } else {
                if (shift < 0) {
                    return a[val] - b[val];
                } else {
                    return b[val] - a[val];
                }
            }
        });
        this.skip = 0;
        this.outputFlatsList = [];
        this.loadMore();
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
        this.sortFlats(item.name, (this.selectFilter ? 1 : -1));
    }

    public openFilter() {
        this.showFilter = !this.showFilter;
        this.showFilter === true ? this.windowScrollLocker.block() : this.windowScrollLocker.unblock();
        this.hideHeader(this.showFilter);
    }
    private hideHeader(val) {
        const header = (document.querySelector('.header-wrap') as HTMLElement);
        const footer = (document.querySelector('.footer') as HTMLElement);
        if (val) {
            header.style.zIndex = '0';
            footer.style.zIndex = '0';
        } else {
            header.style.zIndex = '';
            footer.style.zIndex = '';
        }
    }
}
