import { Component, forwardRef, Input, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SearchBitNumberPipe } from '../../search-output/search-bit-number.pipe';

@Component({
    selector: 'app-inputs-list',
    templateUrl: 'inputs-list.component.html',
    styleUrls: ['./inputs-list.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => InputsListComponent),
            multi: true
        },
        SearchBitNumberPipe,
    ]
})

export class InputsListComponent implements ControlValueAccessor {

    public min: number;
    public max: number;
    private timerSubscr;
    
    @Input() public defValues;
    @Input() public type: 'price' | 'space' | 'floor';
    @Input() public value: { min: number, max: number };
    @Output() public inputChange = new EventEmitter();

    constructor(
        private numberPipe: SearchBitNumberPipe,
    ) {}

    public writeValue(control) {
        if (control) {
            this.start(control.min, control.max);
        }
    }
    public propagateChange = (_: any) => {};
    public registerOnChange(fn) { 
        this.propagateChange = fn;
    }
    public registerOnTouched() {}

    public parseString(type, str) {
        if (!str || !str.length) { return; }
        this.value[type] = this.numberPipe.transform(str);
        switch (type) {
            case 'min': { this.min = this.parseValue(str); break; }
            case 'max': { this.max = this.parseValue(str); break; }
        }
        this.modelChange();
    }
    public modelChange() {
        clearTimeout(this.timerSubscr);
        this.value = { min: this.min, max: this.max };

        if (this.min > this.max
                || this.max < this.min
                || this.min < this.defValues.min
                || this.max > this.defValues.max) {
            return;
        }

        /*
            writeValue записывает значение formControl'a только при инициализации(как я понял)
            и обновлении значения поля формы програмно. Поэтому, что бы при вводе результат
            отобразился и в компоненте "ghm-range-number" emit'ем результат в родительский
            компонент, где через patchValue выставляем значение в форму благодаря чему
            обновляется и значение в компоненте "ghm-range-number"
        */
        this.timerSubscr = setTimeout(() => {
            this.propagateChange({ min: this.min, max: this.max });
            this.inputChange.emit({ min: this.min, max: this.max });
        }, 1000);
    }

    private parseValue(vl): number {
        if (!vl || !vl.length) { return; }
        const regExt = /[^\d]/ig;
        return Number(vl.replace(regExt, ''));
    }
    private start(min, max) {
        this.min = min;
        this.max = max;
        this.value = { min, max };
    }


    public get minValue() {
        return {
            price: this.value.min % 1000000 === 0
                ? this.value.min / 1000000
                : ((this.value.min % 1000000 + '').replace(/[0$]/g, '')).length === 1
                    ? (this.value.min / 1000000).toFixed(1)
                    : (this.value.min / 1000000).toFixed(2),
            space: this.value.min,
            floor: Math.floor(this.value.min),
        };
    }
    public get maxValue() {
        return {
            price: this.value.max % 1000000 === 0
                ? this.value.max / 1000000
                : ((this.value.max % 1000000 + '').replace(/[0$]/g, '')).length === 1
                    ? (this.value.max / 1000000).toFixed(1)
                    : (this.value.max / 1000000).toFixed(2),
            space: this.value.max,
            floor: Math.ceil(this.value.max),
        };
    }
}
