import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'app-search-sorting',
    templateUrl: './search-sorting.component.html',
    styleUrls: ['./search-sorting.component.scss'],
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

export class SearchSortingComponent {

    public activeSort: string;
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
    @Output() public viewTypeChanges = new EventEmitter<any>();

    constructor() {}

    public viewTypeChange(type) {
        if (this.viewType === type) { return; }
        this.viewTypeChanges.emit(type);
    }
    public sortChange(name, value) {
        this.activeValue = +value;
        this.activeSort = this.sortList.find(el => el.name === name && el.value === value).text;
        this.propagateChange(`${name}_${value}`);
        this.showTooltip = false;
    }

    public writeValue(control) {
        if (control) {
            const name = (control).split('_')[0];
            const value = (control).split('_')[1];
            this.activeValue = (control).split('_')[1];
            this.activeSort = (this.sortList.some((item) => item.name === name && item.value === value))
                ? this.sortList.find(el => el.name === name && el.value === value).text
                : this.sortList[0].text;
        }
    }

    public propagateChange = (_: any) => {};
    public registerOnTouched() {}

    public registerOnChange(fn) {
        this.propagateChange = fn;
    }

    public parseText(num) {

        num = Math.abs(num) % 100;
        const words = ['квартира', 'квартиры', 'квартир'];
        const sum = num % 10;

        if (num > 10 && num < 20) { return words[2]; }
        if (sum > 1 && sum < 5) { return words[1]; }
        if (sum === 1) { return words[0]; }
        return words[2];
    }
}
