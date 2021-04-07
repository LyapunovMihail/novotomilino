import { IFlatsSearchParams, TagInterface } from '../../../../serv-files/serv-modules/seo-api/seo.interfaces';
import { MetaTagsRenderService } from '../../commons/meta-tags-render.service';
import { FlatsService } from '../flats.service';
import { FormConfig } from './search-form.config';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, Output, Input, EventEmitter, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';

@Component({
    selector: 'app-search-form',
    templateUrl: './search-form.component.html',
    styleUrls: ['./search-form.component.scss']
})

export class SearchFormComponent implements OnInit, OnDestroy {

    public config = FormConfig;
    public formEvents: any;
    public form: FormGroup;
    public showCorpus = false;

    public seoPageParams: IFlatsSearchParams;
    public isSeoPageParamsLoaded = false;
    public seoPageEvent: any;
    public metaTags: TagInterface[];

    @Input() public showFilter: boolean;
    @Output() public formChange: EventEmitter<any> = new EventEmitter();

    public allHouses;
    public rangeMoved = {
        price: { min: 0, max: 0 },
        space: { min: 0, max: 0 },
        floor: { min: 0, max: 0 },
    };

    constructor(
        public formBuilder: FormBuilder,
        public router: Router,
        public activatedRoute: ActivatedRoute,
        private metaTagsRenderService: MetaTagsRenderService,
        private searchService: FlatsService
    ) { }

    public ngOnInit() {
        // this.buildHouses(this.config);
        this.searchService.getObjects({ type: 'КВ' }).subscribe( flats => {

            this.config.housesList = this.config.housesList.map( house => {
                if (house.value === 'all') { return house; }
                house.disabled = !flats.flats.some(flat => flat.house === Number(house.value));
                return house;
            });
            this.allHouses = this.config.housesList.filter( house => !house.disabled).length - 1;
            setTimeout(() => {
                this.buildForm(this.activatedRoute.snapshot.queryParams);
            }, 600);
        });

        this.seoPageEvent = this.metaTagsRenderService.getFlatsSearchParams()
            .subscribe((params: IFlatsSearchParams) => {
                this.seoPageParams = params;
                this.isSeoPageParamsLoaded = true;
                if (!this.seoPageParams) { return; }
                this.buildForm();
            });

        this.searchService.getMetaTags()
            .subscribe((tags) => {
                    this.metaTags = tags;
                },
                (err) => console.log(err));
    }

    public buildForm(reset?) {

        let params;

        if (this.seoPageParams) {
            params = this.seoPageParams;
        } else if (!reset) {
            params = this.activatedRoute.snapshot.queryParams;
        } else {
            params = reset || this.config;
        }

        const roomsFormArray = ((() => {
            /**
             * if there are rooms in the url's params,
             * then split them into an array,
             * if index is exist, then true
             * otherwise pass an array of false
             */
            const arr = [false, false, false, false, false];
            if (params && params.rooms) {
                const result = parseQueryParams(params.rooms);
                const test = result.every((item) => (/^[0|1|2|3|4]$/).exec((item).toString()) ? true : false);
                if (test) {
                    result.forEach((item) => arr[Number(item)] = true);
                }
            }
            return arr.map((item) => (new FormControl(item)));
        })());

        this.form = this.formBuilder.group({
            space: {
                min: Number(params.spaceMin) || this.config.space.min,
                max: Number(params.spaceMax) || this.config.space.max
            },
            floor: {
                min: Number(params.floorMin) || this.config.floor.min,
                max: Number(params.floorMax) || this.config.floor.max
            },
            price: {
                min: Number(params.priceMin) || this.config.price.min,
                max: Number(params.priceMax) || this.config.price.max
            },
            type: [((type) => {
                if (type && type.split(',').every((item) => this.config.typeList.some((i) => item === i.value))) {
                    return type.split(',');
                }
                return [];
            })(params.type)],
            euro: [((euro) => {
                if (euro && euro.split(',').every((item) => this.config.typePlan.some((i) => item === i.value))) {
                    return euro.split(',');
                }
                return [];
            })(params.euro)],
            furniture: [((furniture) => {
                if (furniture && furniture.split(',').every((item) => this.config.furniture.some((i) => item === i.value))) {
                    return furniture.split(',');
                }
                return [];
            })(params.furniture)],
            status: [((status) => {
                if (status && status.split(',').every((item) => this.config.statusList.some((i) => item === i.value))) {
                    return status.split(',');
                }
                return [];
            })(params.status)],
            decoration: [((decoration) => {
                if (decoration && decoration.split(',').every((item) => this.config.decorationList.some((i) => item === i.value))) {
                    return decoration.split(',');
                }
                return [];
            })(params.decoration)],
            sort: params.sort || this.config.sort,
            rooms: this.formBuilder.array(roomsFormArray) as FormArray,
            houses: [((houses) => {
                /**
                 * if there are houses in the url's params,
                 * then split them into an array,
                 * otherwise pass an empty array
                 */
                if (houses) {
                    const result = parseQueryParams(houses);
                    const test = result.every((item) => (/^[1|2|3|9]$/).exec((item).toString()) ? true : false);
                    return (test) ? result : [];
                }
                return this.config.housesList.filter(el => !el.disabled && el.value !== 'all').map(el => el.value + '');
            })(params.houses)]
        });

        this.formChange.emit({ form: this.form.value, isSeoPageParamsLoaded: this.isSeoPageParamsLoaded, isEmptySeoPageParams: !this.seoPageParams });

        this.formEvents = this.form.valueChanges.subscribe((form) => {
            this.formChange.emit({ form, isSeoPageParamsLoaded: this.isSeoPageParamsLoaded, isEmptySeoPageParams: !this.seoPageParams });
        });

        function parseQueryParams(val: string): string[] {
            return val.replace(/[^,0-9]/gim, '')
                .split(',');
        }
    }

    public formReset() {
        this.buildForm(true);
    }

    public ngOnDestroy() {
        this.formEvents.unsubscribe();
        this.seoPageEvent.unsubscribe();
    }
    public formChanges(val, type) {
        this.form.patchValue({ [type]: val });
    }

    public buildHouses(config) {

        this.searchService.getObjects({}).subscribe( data => {

            this.config.housesList = config.housesList.map( house => {
                if ( house.value === 'all') { return house; }

                house.disabled = !data.flats.some(flat => flat.house === Number(house.value));

                return house;
            });
            this.allHouses = this.config.housesList.filter( house => !house.disabled).length - 1;
        });
    }
}
