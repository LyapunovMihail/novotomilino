import { IAddressItemFlat } from '../../../../serv-files/serv-modules/addresses-api/addresses.interfaces';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { SearchService } from './search.service';
import { PlatformDetectService } from '../../platform-detect.service';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss'],
    providers: [
        SearchService
    ]
})

export class SearchComponent implements OnInit {

    public previousUrl = '';
    public isReturnLink = false;

    public flatsList = [];

    constructor(
        public router: Router,
        public searchService: SearchService,
        public platform: PlatformDetectService
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

        this.router.navigate(['/flats/search'], {queryParams: params});

        this.searchService.getObjects(params).subscribe(
            (data: IAddressItemFlat[]) => {
                this.flatsList = data;
            },
            (err) => {
                console.log(err);
            }
        );
    }
}
