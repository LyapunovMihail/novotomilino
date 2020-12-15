import { Component, OnInit } from '@angular/core';
import { FavoritesService } from '../../../favorites/favorites.service';
import { FormConfig } from '../../search/search-form/search-form.config';
import { SearchService } from '../../search/search.service';
import { CommercialService } from '../commercial.service';

@Component({
    selector: 'app-commercial-list',
    templateUrl: './commercial-list.component.html',
    styleUrls: ['./commercial-list.component.scss'],
    providers: [
        CommercialService,
        SearchService
    ]
})

export class CommercialListComponent implements OnInit {

    public count: number;
    public skip: number;
    public params: any;
    public sort: string = FormConfig.sort;
    public outputFlatsList;
    public searchFlats;
    public isLoadMoreBtn = false;

    constructor(
        public commercialService: CommercialService,
        public favoritesService: FavoritesService,
        public searchService: SearchService,
    ) { }

    ngOnInit() { }

    public formChange(form) {
        if (!form) { return; }

        const params = {
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
        this.commercialService.getObjects({ ...params, type: 'КН' }).subscribe(
            data => {
                this.searchFlats = data.filter(item => item.status === '4');
                this.searchFlats.map((flat) => {
                    flat.inFavorite = this.inFavorite(flat);
                    return flat;
                });
                this.count = this.searchFlats.length;
                this.loadMore();
            },
            (err) => {
                console.log(err);
            }
        );
    }
    public scrollUp() {
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
    public sortFlats(sort) {
        this.searchService.sortFlats(sort, this.searchFlats);
        this.skip = 0;
        this.outputFlatsList = [];
        this.loadMore();
    }

    public inFavorite(flat): boolean {
        return this.favoritesService.inFavorite(flat);
    }
}
