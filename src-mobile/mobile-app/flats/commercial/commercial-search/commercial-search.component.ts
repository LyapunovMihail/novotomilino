import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WindowScrollLocker } from '../../../commons/window-scroll-block';
import { FavoritesService } from '../../../favorites/favorites.service';
import { CommercialService } from '../commercial.service';

@Component({
    selector: 'app-commercial-search',
    templateUrl: 'commercial-search.component.html',
    styleUrls: ['./commercial-search.component.scss'],
    providers: [
        CommercialService,
        WindowScrollLocker
    ]
})

export class CommercialSearchComponent implements OnInit {

    public showFilter = false;
    public isLoadMoreBtn = false;
    public skip: number;
    public outputFlatsList;
    public searchFlats;

    public params: any = {};

    constructor(
        private activatedRouter: ActivatedRoute,
        private commercialService: CommercialService,
        public windowScrollLocker: WindowScrollLocker,
        public favoritesService: FavoritesService,
    ) { }

    ngOnInit() {
        this.getParams();
        this.getApartaments();
    }

    private getApartaments() {
        this.commercialService.getObjects({ ...this.params, type: 'КН' }).subscribe(
            data => {
                this.searchFlats = data.filter(item => item.status === '4');
                this.searchFlats.map((flat) => {
                    flat.inFavorite = this.inFavorite(flat);
                    return flat;
                });
                this.loadMore();
            }
        );
    }
    private inFavorite(flat): boolean {
        return this.favoritesService.inFavorite(flat);
    }
    private getParams() {
        this.params = {
            houses: this.activatedRouter.snapshot.queryParams.house,
            floor: this.activatedRouter.snapshot.queryParams.floor,
            sections: this.activatedRouter.snapshot.queryParams.section,
        };
        console.log(this.params);
    }

    public formChange(form) {
        if (!form) { return; }

        const params = {
            spaceMin: form.space.min,
            spaceMax: form.space.max,
            priceMin: form.price.min,
            priceMax: form.price.max,
        };

        this.getParams();

        this.params = { ...this.params, ...params };
        this.skip = 0;
        this.outputFlatsList = [];

        this.getApartaments();
    }
    public loadMore() {
        for (let i = 0; i < 10; i++) {
            if (this.skip < this.searchFlats.length) {
                this.outputFlatsList.push(this.searchFlats[this.skip++]);
            }
        }
        this.isLoadMoreBtn = this.skip < this.searchFlats.length;
    }
    public scrollTop() {
        window.scrollTo(0, 0);
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
