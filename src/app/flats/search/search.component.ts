import { Router } from '@angular/router';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { IAddressItemFlat } from '../../../../serv-files/serv-modules/addresses-api/addresses.interfaces';
import { IFlatsSearchParams } from '../../../../serv-files/serv-modules/seo-api/seo.interfaces';
import { AuthorizationObserverService } from '../../authorization/authorization.observer.service';
import { FormConfig } from './search-form/search-form.config';
import { SearchService } from './search.service';
import { PlatformDetectService } from '../../platform-detect.service';
import { WindowScrollLocker } from '../../commons/window-scroll-block';

@Component({
    selector: 'app-flats-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss'],
    providers: [
        WindowScrollLocker,
        SearchService
    ]
})

export class SearchComponent implements OnInit, OnChanges, OnDestroy {

    public isAuthorizated = false;
    public authorizationEvent;

    public outputFlatsList: IAddressItemFlat[] = [];
    public searchFlats: IAddressItemFlat[] = [];
    public count: number;
    public skip: number;
    public form: any;
    public sort: string = FormConfig.sort;
    public params: any;
    public isLoadMoreBtn = false;

    public preloaderFlats = false;

    public seoPageParams: IFlatsSearchParams;
    public isSeoPageModalOpen = false;

    public loadMoreFirst = true; // первое нажатие "Показать еще"

    @Input() public parentPlan: boolean;
    @Input() public showSearchWindow: boolean;
    @Input() public housesFromMinimap: string[];
    @Output() public flatsChanged: EventEmitter<IAddressItemFlat[]> = new EventEmitter();
    @Output() public showPopular = new EventEmitter<any>();

    constructor(
        public router: Router,
        private authorization: AuthorizationObserverService,
        public searchService: SearchService,
        public platform: PlatformDetectService,
        public windowScrollLocker: WindowScrollLocker
    ) {}

    public ngOnInit() {
        this.authorizationEvent = this.authorization.getAuthorization()
            .subscribe((val) => {
                this.isAuthorizated = val;
            });

        if (!this.showSearchWindow) {return; }
    }

    public formChange(changedForm) {
        this.form = changedForm.form;
        if (!this.showSearchWindow) {return; }

        const { form, isSeoPageParamsLoaded, isEmptySeoPageParams } = changedForm;

        const params: any = {
            spaceMin: form.space.min,
            spaceMax: form.space.max,
            priceMin: form.price.min,
            priceMax: form.price.max,
            floorMin: form.floor.min,
            floorMax: form.floor.max,
        };

        if (form['type'].length > 0) {
            params['type'] = (form.type).join(',');
        }

        if (form['euro'].length > 0) {
            params['euro'] = (form.euro).join(',');
        }

        if (form['decoration'].length > 0) {
            params['decoration'] = (form.decoration).join(',');
        }

        if (form['status'].length > 0) {
            params['status'] = (form.status).join(',');
        }

        if ( 'rooms' in form && form.rooms.some((i) => i === true) ) {
            params['rooms'] = (form.rooms).map((index, i) => (index) ? i : false).filter((i) => i !== false).join(',');
        }

        if ( 'houses' in form && form.houses.length > 0 ) {
            params['houses'] = (form.houses).join(',');
        }

        this.skip = 0;
        this.outputFlatsList = [];

        this.seoPageParams = params;

        if (isSeoPageParamsLoaded && isEmptySeoPageParams) {
            this.router.navigate([this.router.url.split('?')[0]], {queryParams: params});
        }

        this.getFlats(params);
    }

    public getFlats(params) {
        this.preloaderFlats = true;

        this.searchService.getObjects(params).subscribe(
            (data: IAddressItemFlat[]) => {
                this.loadMoreFirst = true;
                this.count = data.length;
                this.searchFlats = data;

                this.sortFlats();
                this.loadMore();
                this.flatsChanged.emit(this.searchFlats);
                this.preloaderFlats = false;
            },
            (err) => {
                this.preloaderFlats = false;
                console.log(err);
            }
        );
    }

    public loadMore(num?) {
        if (this.loadMoreFirst) { this.addFavoriteSnippet(); }
        this.loadMoreFirst = false;

        for (let i = 0; i < (num || 12); i++) {
            if (this.skip < this.searchFlats.length) {
                this.outputFlatsList.push(this.searchFlats[this.skip++]);
            }
        }
        this.isLoadMoreBtn = this.skip < this.searchFlats.length;
        this.searchService.setOutputFlatsChanged(this.outputFlatsList);
    }
    private addFavoriteSnippet() {
        let lastIndex;
        const flats = new Array(this.searchFlats.length).fill(null);
        flats.forEach( (flat, i) => {
            if (i < 14) { return; }
            const start = lastIndex ? lastIndex + 7 : i + 1;
            const end = start + 10;
            const index = this.randomNum(start, end);

            if (!this.searchFlats[index]) { return; }
            lastIndex = index;
            const icon = { ...this.searchFlats[index] };
            icon.type = 'favorite';
            icon.price = this.searchFlats[index].price - 1;
            this.searchFlats.splice(index, 0, icon);
        });
    }
    private randomNum(start, end) {
        return Math.floor(Math.random() * (end - start)) + start;
    }

    public ngOnChanges() {
        if (this.showSearchWindow) {
            setTimeout(() => {
                this.windowScrollLocker.unblock();
                this.formChange({ form: this.form, isSeoPageParamsLoaded: false, isEmptySeoPageParams: true });
                if (this.parentPlan) {
                    document.body.style.padding = '0';
                }
            }, 550); // таймаут чтобы анимация открытия окна отработала без тормозов
        } else {
            this.router.navigate([this.router.url.split('?')[0]]);
            this.outputFlatsList = [];
            setTimeout(() => {
                this.windowScrollLocker.block();
            }, 130); // таймаут чтобы при смене роута на этой же и других страницах экран успел проскроллиться вверх перед блокировкой скролла
        }
    }

    public sortChange(sort) {
        this.sort = sort;
        this.skip = 0;
        this.outputFlatsList = [];
        this.searchFlats = this.searchFlats.filter(el => el.type !== 'favorite');
        this.loadMoreFirst = true;

        this.sortFlats();
        this.loadMore();
    }
    public noticeChange() {
        const limit = this.outputFlatsList.length;
        this.skip = 0;
        this.outputFlatsList = [];
        this.searchFlats = this.searchFlats.filter(el => el.type !== 'favorite');

        this.loadMore(limit);
    }

    public sortFlats() {
        this.searchService.sortFlats(this.sort, this.searchFlats);
    }

    public ngOnDestroy() {
        this.windowScrollLocker.unblock();
        this.authorizationEvent.unsubscribe();
    }
}
