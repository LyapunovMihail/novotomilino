import { Router } from '@angular/router';
import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { IAddressItemFlat } from '../../../../serv-files/serv-modules/addresses-api/addresses.config';
import { IFlatResponse } from '../../../../serv-files/serv-modules/addresses-api/addresses.interfaces';
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

    public flatsList = [];
    public form: any;
    public params: any;
    public isLoadMoreBtn = false;

    @Input() public showSearchWindow = false;
    @Input() public parentPlan: boolean;

    constructor(
        public router: Router,
        public searchService: SearchService,
        public platform: PlatformDetectService,
        public windowScrollLocker: WindowScrollLocker
    ) {}

    public ngOnInit() {
        if (this.platform.isBrowser) {
            if (!this.showSearchWindow) {return; }
        }
    }

    public formChange(form) {
        console.log('this.showSearchWindow: ', this.showSearchWindow);
        this.form = form;
        console.log('this.form: ', this.form);
        if (!this.showSearchWindow) {return; }

        const params = {
            spaceMin: form.space.min,
            spaceMax: form.space.max,
            priceMin: form.price.min,
            priceMax: form.price.max,
            floorMin: form.floor.min,
            floorMax: form.floor.max,
            sort: form.sort,
        };

        if (form.type.length > 0) {
            params['type'] = (form.type).join(',');
        }

        if (form.decoration.length > 0) {
            params['decoration'] = (form.decoration).join(',');
        }

        if ( 'rooms' in form && form.rooms.some((i) => i === true) ) {
            params['rooms'] = (form.rooms).map((index, i) => (index) ? (i === 4) ? 0 : i + 1 : false).filter((i) => i !== false).join(',');
        }

        if ( 'houses' in form && form.houses.length > 0 ) {
            params['houses'] = (form.houses).join(',');
        }

        console.log('queryParams: ', params);

        this.params = params;
        this.params.skip = 0;
        this.params.limit = 10;

        this.getFlats(params);
    }

    public loadMore() {
        this.params.skip += 10;
        this.getFlats(this.params);
    }

    public getFlats(params) {

        this.router.navigate([this.router.url.split('?')[0]], {queryParams: params});
        this.searchService.getObjects(params).subscribe(
            (data: IFlatResponse) => {
                this.isLoadMoreBtn = ( data.flats.length < params.limit ) ? false : true ;
                this.flatsList = data.flats;
            },
            (err) => {
                console.log(err);
            }
        );
    }

    public ngOnChanges() {
        if (this.showSearchWindow) {
            setTimeout(() => {
                this.formChange(this.form);
                this.windowScrollLocker.unblock();
            }, 500); // таймаут чтобы анимация открытия окна отработала без тормозов

        } else {
            this.router.navigate([this.router.url.split('?')[0]]);
            this.flatsList = [];
            setTimeout(() => {
                this.windowScrollLocker.block();
            }, 130); // таймаут чтобы при смене роута на этой же и других страницах экран успел проскроллиться вверх перед блокировкой скролла
        }
    }

    public ngOnDestroy() {
        this.windowScrollLocker.unblock();
    }
}
