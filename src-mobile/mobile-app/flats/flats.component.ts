import { PlatformDetectService } from './../platform-detect.service';
import { IFlatWithDiscount } from '../../../serv-files/serv-modules/addresses-api/addresses.interfaces';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FlatsService } from './flats.service';
import { WindowScrollLocker } from '../commons/window-scroll-block';
import { FlatsDiscountService } from '../commons/flats-discount.service';
import { FavoritesService } from '../favorites/favorites.service';

@Component({
    selector: 'app-flats',
    templateUrl: './flats.component.html',
    styleUrls: ['./flats.component.scss'],
    providers: [
        FlatsService,
        WindowScrollLocker
    ]
})

export class FlatsComponent implements OnInit {

    public previousUrl = '';
    public isReturnLink = false;
    public params: any = {};
    public flatsList: IFlatWithDiscount[] = [];
    public isLoadMoreBtn = false;
    public isVisible: boolean;
    public counter: number = 0;

    public showFilter: boolean;
    public skip = 0;
    public outputFlatsList;
    public viewType: 'block' | 'inline' = 'block';

    public loadMoreFirst = true; // первое нажатие "Показать еще"

    constructor(
        public router: Router,
        public searchService: FlatsService,
        public platform: PlatformDetectService,
        public windowScrollLocker: WindowScrollLocker,
        private flatsDiscountService: FlatsDiscountService,
        private favoritesService: FavoritesService,
    ) {}

    ngOnInit() {
        if (this.platform.isBrowser) {
            if ( localStorage.getItem('previousRoute') ) {
                this.previousUrl = localStorage.getItem('previousRoute');
                localStorage.removeItem('previousRoute');
                this.isReturnLink = true;
            } else {
                this.isReturnLink = false;
            }
        }
    }

    public openFilter() {
        this.showFilter = !this.showFilter;
        this.showFilter === true ? this.windowScrollLocker.block() : this.windowScrollLocker.unblock();
    }

    public formChange(changedForm) {
        const { form, isSeoPageParamsLoaded, isEmptySeoPageParams } = changedForm;

        const params = {
            spaceMin: form.space.min,
            spaceMax: form.space.max,
            priceMin: form.price.min,
            priceMax: form.price.max,
            floorMin: form.floor.min,
            floorMax: form.floor.max,
            sort: this.params.sort || form.sort,
        };

        if (form.type.length > 0) {
            params['type'] = (form.type).join(',');
        }

        if (form['euro'].length > 0) {
            params['euro'] = (form.euro).join(',');
        }

        if (form['furniture'].length > 0) {
            params['furniture'] = (form.furniture).join(',');
        }

        if (form['status'].length > 0) {
            params['status'] = (form.status).join(',');
        }

        if (form.decoration.length > 0) {
            params['decoration'] = (form.decoration).join(',');
        }

        if ( 'rooms' in form && form['rooms'].some((i) => i === true) ) {
            params['rooms'] = (form.rooms).map((index, i) => (index) ? i : false).filter((i) => i !== false).join(',');
        }

        if ( 'houses' in form && form['houses'].length > 0 ) {
            params['houses'] = (form.houses).join(',');
        }

        this.skip = 0;
        this.params = params;
        this.outputFlatsList = [];

        if (isSeoPageParamsLoaded && isEmptySeoPageParams) {
            this.router.navigate([this.router.url.split('?')[0]], {queryParams: params});
        }
        // this.router.navigate([this.router.url.split('?')[0]], {queryParams: params});

        this.getFlats(params);
    }

    public loadMore(limit?) {
        if (this.loadMoreFirst) { this.addFavoriteSnippet(); }
        this.loadMoreFirst = false;
        for (let i = 0; i < (limit || 6); i++) {
            if (this.skip < this.flatsList.length) {
                this.outputFlatsList.push(this.flatsList[this.skip++]);
            }
        }
        this.isLoadMoreBtn = this.skip < this.flatsList.length;
    }

    public getFlats(params?) {
        this.skip = 0;
        this.outputFlatsList = [];
        // console.log(this.params.sort);
        this.searchService.getFlats(params || this.params).subscribe(
            (data: IFlatWithDiscount[]) => {
                this.loadMoreFirst = true;
                this.counter = data.length;
                this.flatsList = data.map((flat) => {
                    flat.discount = this.getDiscount(flat);
                    flat.inFavorite = this.inFavorite(flat);
                    return flat;
                });

                this.loadMore();
            },
            (err) => {
                console.log(err);
            }
        );
    }

    private addFavoriteSnippet() {
        let lastIndex;
        const flats = new Array(this.flatsList.length).fill(null);
        flats.forEach( (flat, i) => {
            if (i < 7) { return; }
            const start = lastIndex ? lastIndex + 7 : i + 1;
            const end = start + 7;
            const index = this.randomNum(start, end);

            if (!this.flatsList[index]) { return; }
            lastIndex = index;
            const icon = { ...this.flatsList[index] };
            icon.type = 'favorite';
            icon.price = this.flatsList[index].price - 1;
            this.flatsList.splice(index, 0, icon);
        });
        // console.log(count, this.flatsList);
    }
    private randomNum(start, end) {
        return Math.floor(Math.random() * (end - start)) + start;
    }

    public sortChange(sort) {
        const name = (sort.split('_'))[0];
        const value = (sort.split('_'))[1];
        this.viewType = (sort.split('_'))[2];
        this.params.sort = `${name}_${value}`;
    }
    public noticeChange() {
        const limit = this.outputFlatsList.length;
        this.skip = 0;
        this.outputFlatsList = [];
        this.flatsList = this.flatsList.filter(el => el.type !== 'favorite');

        this.loadMore(limit);
    }

    public getDiscount(flat): number {
        return this.flatsDiscountService.getDiscount(flat);
    }
    public inFavorite(flat): boolean {
        return this.favoritesService.inFavorite(flat);
    }
}
