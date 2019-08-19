import { IAddressItemFlat } from '../../../../serv-files/serv-modules/addresses-api/addresses.interfaces';
import { Router } from '@angular/router';
import { AfterViewInit, Component, Input, OnChanges, OnInit } from '@angular/core';
import { SearchService } from './search.service';
import { PlatformDetectService } from '../../platform-detect.service';
import { WindowScrollLocker } from '../../commons/window-scroll-block';
declare let $: any;

@Component({
    selector: 'app-flats-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss'],
    providers: [
        WindowScrollLocker,
        SearchService
    ]
})

export class SearchComponent implements OnInit, OnChanges, AfterViewInit {

    public previousUrl = '';
    public isReturnLink = false;
    public flatsList = [];
    public form: any;
    public flatsHeightWithoutParams: number; // для сохранения высоты квартир до открытия параметров подбора чтобы закрепить футер
    @Input() public showSearchWindow = false;

    constructor(
        public router: Router,
        public searchService: SearchService,
        public platform: PlatformDetectService,
        public windowScrollLocker: WindowScrollLocker
    ) {}

    public ngOnInit() {
        if (this.platform.isBrowser) {
            if (!this.showSearchWindow) {return; }
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
        console.log('this.showSearchWindow: ', this.showSearchWindow);
        this.form = form;
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

        if ( 'rooms' in form && form['rooms'].some((i) => i === true) ) {
            params['rooms'] = (form.rooms).map((index, i) => (index) ? (i === 3) ? 0 : i + 1 : false).filter((i) => i !== false).join(',');
        }

        if ( 'sections' in form && form['sections'].length > 0 ) {
            params['sections'] = (form.sections).join(',');
        }

        console.log('queryParams: ', params);
        this.router.navigate([this.router.url.split('?')[0]], {queryParams: params});

        this.searchService.getObjects(params).subscribe(
            (data: IAddressItemFlat[]) => {
                this.flatsList = data;
                this.setFlatsHeight();
            },
            (err) => {
                console.log(err);
            }
        );
    }

    public ngAfterViewInit() {
        this.flatsHeightWithoutParams = $('.flats').height();
    }

    public ngOnChanges() {
        if (this.showSearchWindow) {
            this.formChange(this.form);
            this.windowScrollLocker.unblock();
        } else {
            this.router.navigate([this.router.url.split('?')[0]]);
            this.windowScrollLocker.block();
            this.setFlatsHeight();
        }
    }

    // Для динамичного задания высоты квартир, так как при открытии параметров подбора изменяется высота и съезжает футер.
    public setFlatsHeight() {
        setTimeout(() => {
            if (this.showSearchWindow) {
                $('.flats').css('height', this.flatsHeightWithoutParams + $('.search-output').height() - 440);
            } else {
                $('.flats').css('height', this.flatsHeightWithoutParams);
            }
        }, 20);
    }
}
