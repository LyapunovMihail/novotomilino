import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CommercialService } from '../commercial.service';

@Component({
    selector: 'app-commercial-filter',
    templateUrl: 'commercial-filter.component.html',
    styleUrls: ['./commercial-filter.component.scss']
})

export class CommercialFilterComponent implements OnInit {

    public form: FormGroup;
    public formEvents;
    public config;
    public allHouses;

    public showCorpus = false;

    @Input() public type = 'commercial-list';
    @Input() public showFilter = false;
    @Output() public close = new EventEmitter<any>();
    @Output() public formChange = new EventEmitter<any>();

    constructor(
        public fb: FormBuilder,
        public commercialService: CommercialService
    ) { }

    public getControl = control => this.form.get(control);

    ngOnInit() {
        this.commercialService.getObjects({ type: 'КН' }).subscribe(
            flats => {
                this.config = this.commercialService.parseConfig(flats);
                this.allHouses = this.config.housesList.filter( house => !house.disabled).length - 1;
                this.buildForm(this.config);
            }
        );
    }

    private buildForm(params?) {
        this.form = this.fb.group({
            space: {
                min: Number(params.spaceMin) || this.config.space.min,
                max: Number(params.spaceMax) || this.config.space.max
            },
            price: {
                min: Number(params.priceMin) || this.config.price.min,
                max: Number(params.priceMax) || this.config.price.max
            },
            houses: [((houses) => {
                if (houses) {
                    const result = parseQueryParams(houses);
                    const test = result.every((item) => (/^[1|2|3|4|5|6|7|8]$/).exec((item).toString()) ? true : false);
                    return (test) ? result : [];
                }
                return [];
            })(params.houses)]
        });

        this.formChange.emit( this.form.value );
        this.formEvents = this.form.valueChanges.subscribe( value => this.formChange.emit( value ) );

        function parseQueryParams(val: string): string[] {
            return val.replace(/[^,0-9]/gim, '')
                .split(',');
        }
    }
    public formReset() {
        this.buildForm({});
    }
}
