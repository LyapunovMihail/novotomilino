import { FormConfig } from './search-form.config';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
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
    public showCorpus: boolean = false;

    @Output() public formChange: EventEmitter<any> = new EventEmitter();

    constructor (
        public formBuilder: FormBuilder,
        public router: Router,
        public activatedRoute: ActivatedRoute
    ) { }

    public ngOnInit() {

        let params = this.activatedRoute.snapshot.queryParams;

        let roomsFormArray = ((() => {
            /**
             * if there are rooms in the url's params,
             * then split them into an array,
             * if index is exist, then true
             * otherwise pass an array of false
             */
            let arr = [false, false, false, false];
            if (params.rooms) {
                let result = parseQueryParams(params.rooms);
                let test = result.every((item) => (/^[0|1|2|3]$/).exec((item).toString()) ? true : false);
                if (test) {
                    result.forEach((item) => arr[(item === 0) ? 3 : item - 1] = true);
                }
            }
            return arr.map((item) => (new FormControl(item)));
        })());

        this.form = this.formBuilder.group({
            space: {
                min: params.spaceMin || this.config.space.min,
                max: params.spaceMax || this.config.space.max
            },
            floor: {
                min: params.floorMin || this.config.floor.min,
                max: params.floorMax || this.config.floor.max
            },
            price: {
                min: params.priceMin || this.config.price.min,
                max: params.priceMax || this.config.price.max
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
            rooms: <FormArray> this.formBuilder.array(roomsFormArray),
            sections: [((sections) => {
                /**
                 * if there are sections in the url's params,
                 * then split them into an array,
                 * otherwise pass an empty array
                 */
                if (sections) {
                    let result = parseQueryParams(sections);
                    let test = result.every((item) => (/^[1|2|3|4|5|6]$/).exec((item).toString()) ? true : false);
                    return (test) ? result : [];
                }
                return [];
            })(params.sections)]
        });

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

    public ngOnDestroy () {
        this.formEvents.unsubscribe();
    }

}
