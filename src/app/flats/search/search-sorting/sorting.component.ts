import { animate, style, transition, trigger } from '@angular/animations';
import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { FlatsDiscountService } from '../../../commons/flats-discount.service';

@Component({
    selector: 'app-search-sorting',
    templateUrl: './sorting.component.html',
    styleUrls: ['./sorting.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SearchSortingComponent),
            multi: true
        }
    ],
    animations: [
        trigger('showHideTooltip', [
            transition('void => *', [
                style({
                    opacity: 0,
                    transform: 'translateY(-10px)'
                }),
                animate('200ms ease-in',
                    style({
                        opacity: 1,
                        transform: 'translateY(0px)'
                    }))
            ])
        ])
    ]
})

export class SearchSortingComponent implements OnInit {

    public activeSort: string;
    public activeViewType: string;
    public activeValue: number;
    public showTooltip: boolean;
    public sortList = [
        { name: 'price', text: 'Сначала дешевле', value: '1' },
        { name: 'price', text: 'Сначала дороже', value: '0' },
        { name: 'space', text: 'Сначала с большей площадью', value: '0' },
        { name: 'space', text: 'Сначала с меньшей площадью', value: '1' },
    ];

    @Input() public counter;
    @Input() public hideViewTypeBtn: boolean;
    @Input() public viewType: 'block' | 'inline';

    constructor( public flatsDiscountService: FlatsDiscountService ) {}

    ngOnInit() {
        this.flatsDiscountService.getFilterValue().subscribe( (obj) => {
            this.sortChange(obj.name, obj.value);
        });
    }

    public viewTypeChange(type) {
        if (this.activeViewType === type) { return; }
        this.activeViewType = type;
        const activeSort = this.sortList.find(el => el.text === this.activeSort);
        this.propagateChange(`${activeSort.name}_${activeSort.value}_${this.activeViewType}`);
    }
    public sortChange(name, value) {
        this.activeValue = +value;
        this.activeSort = this.sortList.find(el => el.name === name && el.value === value).text;
        this.propagateChange(`${name}_${value}_${this.activeViewType}`);
        this.showTooltip = false;
    }

    public writeValue(control) {
        if (control) {
            const name = (control).split('_')[0];
            const value = (control).split('_')[1];
            this.activeValue = (control).split('_')[1];
            this.activeViewType = (control).split('_')[2] || this.viewType || 'block';
            this.activeSort = (this.sortList.some((item) => item.name === name && item.value === value))
                ? this.sortList.find(el => el.name === name && el.value === value).text
                : this.sortList[0].text;
        }
    }

    public propagateChange = (_: any) => {};

    public registerOnChange(fn) {
        this.propagateChange = fn;
    }
    public registerOnTouched() {}

}
