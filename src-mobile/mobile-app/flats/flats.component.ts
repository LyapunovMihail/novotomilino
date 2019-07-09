import { PlatformDetectService } from './../platform-detect.service';
import { IAddressItemFlat, IFlatResponse } from '../../../serv-files/serv-modules/addresses-api/addresses.interfaces';
import { Router } from '@angular/router';
import { Component, OnInit, Inject, HostListener, ElementRef } from '@angular/core';
import { FlatsService } from './flats.service';
import { DOCUMENT } from '@angular/common';
declare let $: any;

@Component({
    selector: 'app-flats',
    templateUrl: './flats.component.html',
    styleUrls: ['./flats.component.scss'],
    providers: [
        FlatsService
    ]
})

export class FlatsComponent implements OnInit {

    public previousUrl = '';
    public isReturnLink = false;
    public params: any;
    public flatsList: IAddressItemFlat[] = [];
    public isLoadMoreBtn = false;
    public isVisible: boolean = false;
    public counter: number = 0;

    constructor(
        public router: Router,
        public searchService: FlatsService,
        public platform: PlatformDetectService,
        public elRef: ElementRef
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

    @HostListener('window:scroll', [])
    public windowScroll() {
        const num = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        const form = this.elRef.nativeElement.querySelector('.search').offsetHeight;

        this.isVisible = (num >= form - 100)
            ? true
            : false;
    }

    public scrollToTop() {
        if (!this.platform.isBrowser) { return false; }

        $('html, body').animate({scrollTop: 0 }, 200);
    }

    public formChange(form) {
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

        if ( 'rooms' in form && form['rooms'].some((i) => i === true) ) {
            params['rooms'] = (form.rooms).map((index, i) => (index) ? (i === 3) ? 0 : i + 1 : false).filter((i) => i !== false).join(',');
        }

        if ( 'sections' in form && form['sections'].length > 0 ) {
            params['sections'] = (form.sections).join(',');
        }

        this.params = params;
        this.params.skip = 0;
        this.params.limit = 10;

        this.getFlats();
    }

    public loadMore() {
        this.params.skip += 10;
        this.getFlats( );
    }

    public getFlats() {
        this.router.navigate(['/flats/search'], {queryParams: this.params});
        this.searchService.getObjects(this.params).subscribe(
            (data: IFlatResponse) => {
                this.counter = data.count;
                this.responseParse(data.flats);
                this.flatsList = data.flats;
            },
            (err) => {
                console.log(err);
            }
        );
    }

    public responseParse(response) {
        this.isLoadMoreBtn = ( response.length < this.params.limit ) ? false : true ;
    }
}
