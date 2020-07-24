import { PlatformDetectService } from './../platform-detect.service';
import { IAddressItemFlat, IFlatResponse } from '../../../serv-files/serv-modules/addresses-api/addresses.interfaces';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FlatsService } from './flats.service';
import { WindowScrollLocker } from '../commons/window-scroll-block';

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
    public flatsList: IAddressItemFlat[] = [];
    public isLoadMoreBtn = false;
    public isVisible: boolean = false;
    public counter: number = 0;

    public showFilter: boolean = false;
    public skip = 0;
    public outputFlatsList;

    constructor(
        public router: Router,
        public searchService: FlatsService,
        public platform: PlatformDetectService,
        public windowScrollLocker: WindowScrollLocker
    ) {}

    public ngOnInit() {
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

    /*
    @HostListener('window:scroll', [])
    public windowScroll() {
        const num = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        const form = this.elRef.nativeElement.querySelector('.search-form').offsetHeight;

        this.isVisible = (num >= 500)
            ? true
            : false;
    }

    public scrollToTop() {
        if (!this.platform.isBrowser) { return false; }

        $('html, body').animate({scrollTop: 0 }, 200);
    }
    */

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

        if (form['status'].length > 0) {
            params['status'] = (form.status).join(',');
        }

        if (form.decoration.length > 0) {
            params['decoration'] = (form.decoration).join(',');
        }

        if ( 'rooms' in form && form['rooms'].some((i) => i === true) ) {
            params['rooms'] = (form.rooms).map((index, i) => (index) ? (i === 4) ? 0 : i + 1 : false).filter((i) => i !== false).join(',');
        }

        if ( 'houses' in form && form['houses'].length > 0 ) {
            params['houses'] = (form.houses).join(',');
        }

        this.params = params;
        // this.params.skip = 0;
        // this.params.limit = 10;
        this.skip = 0;
        this.outputFlatsList = [];

        if (isSeoPageParamsLoaded && isEmptySeoPageParams) {
            this.router.navigate([this.router.url.split('?')[0]], {queryParams: params});
        }
        console.log('params', params)
        this.router.navigate([this.router.url.split('?')[0]], {queryParams: params});

        this.getFlats();
    }

    public loadMore() {
        // this.params.skip += 10;
        // this.getFlats();
        for (let i = 0; i < 10; i++) {
            if (this.skip < this.flatsList.length) {
                this.outputFlatsList.push(this.flatsList[this.skip++]);
            }
        }
        this.isLoadMoreBtn = this.skip < this.flatsList.length;
    }

    public getFlats() {
        this.skip = 0;
        this.outputFlatsList = [];
        console.log(this.params.sort);
        this.searchService.getFlats(this.params).subscribe(
            (data: IAddressItemFlat[]) => {
                this.counter = data.length;
                this.flatsList = data;
                // this.responseParse(data.flats);
                if (this.params.rooms === '1' || this.params.rooms === '2') {
                    this.flatsList = this.filterFlats(this.params.rooms, data);
                    this.counter = this.flatsList.length;
                }
                this.loadMore();
            },
            (err) => {
                console.log(err);
            }
        );
    }

    public responseParse(response) {
        if ( this.params.skip === 0 ) {
            this.flatsList = response;
        } else {
            this.flatsList = this.flatsList.concat(response);
        }
        this.isLoadMoreBtn = ( response.length < this.params.limit ) ? false : true ;
    }
    public filterFlats(i, flats) {
        console.log(flats);
        let isFilterFlats;
        if (i === '1') {
            isFilterFlats = flats.filter( flat => {
                if (flat.rooms === 2 && flat.space < 34) { return flat; } // 2к кв площадь которых < 34м = 1комн и 2комн
                if (flat.rooms === 1 && flat.space >= 41) { return; } // 1к кв площадь которых >= 41м = 2комн
                if (flat.rooms === Number(i)) { return flat; }
            });
        }
        if (i === '2') {
            isFilterFlats = flats.filter( flat => {
                if (flat.rooms === 1 && flat.space < 41.31) { return flat; }  // 1к кв площадь которых < 41м = 1комн и 2комн
                if (flat.rooms === 1 && flat.space >= 41.31) { return flat; } // 1к кв площадь которых >= 41м = 2комн
                if (flat.rooms === Number(i)) { return flat; }
            });
        }
        return isFilterFlats;
    }
}
