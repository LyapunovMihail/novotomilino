import { FormConfig } from './search-form.config';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, Output, EventEmitter, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';

@Component({
    selector: 'app-search-form',
    templateUrl: './search-form.component.html',
    styleUrls: ['./../search.component.scss']
})

export class SearchFormComponent implements OnInit, OnDestroy {

    public config = FormConfig;
    public formEvents: any;
    public form: FormGroup;
    public moreFilter: boolean = false;
    public showCorpus: boolean = false;

    @Output() public formChange: EventEmitter<any> = new EventEmitter();

    constructor(
        public formBuilder: FormBuilder,
        public router: Router,
        public activatedRoute: ActivatedRoute,
    ) {}

    public ngOnInit() {
        const params = this.activatedRoute.snapshot.queryParams;
        this.buildForm(params);
    }

    public buildForm(params) {
        const roomsFormArray = ((() => {
            /**
             * if there are rooms in the url's params,
             * then split them into an array,
             * if index is exist, then true
             * otherwise pass an array of false
             */
            const arr = [false, false, false, false, false];
            if (params.rooms) {
                const result = parseQueryParams(params.rooms);
                const test = result.every((item) => (/^[0|1|2|3|4]$/).exec((item).toString()) ? true : false);
                if (test) {
                    result.forEach((item) => arr[(item === 0) ? 4 : item - 1] = true);
                }
            }
            return arr.map((item) => (new FormControl(item)));
        })());

        console.log('params: ', params);
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
                    const test = result.every((item) => (/^[1|2|3|4]$/).exec((item).toString()) ? true : false);
                    return (test) ? result : [];
                }
                return [];
            })(params.houses)]
        });

        console.log('this.form formComp : ', this.form.value);
        this.formChange.emit(this.form.value);

        this.formEvents = this.form.valueChanges.subscribe((form) => {
            this.formChange.emit(form);
        });

        function parseQueryParams(val: string): number[] {
            return val.replace(/[^,0-9]/gim, '')
                .split(',')
                .map((item) => Number(item));
        }
    }

    public formReset() {
        this.buildForm({});
    }

    public ngOnDestroy() {
        this.formEvents.unsubscribe();
    }
}
