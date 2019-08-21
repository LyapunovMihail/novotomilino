import { Component, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'app-search-checkbox-list',
    templateUrl: './checkbox-list.component.html',
    styleUrls: ['./checkbox-list.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => CheckboxListComponent),
            multi: true
        }
    ]
})

export class CheckboxListComponent {

    @Input() public btnList: any[] = [];
    @Input() public name: string;

    public activeList: string[] = [];

    constructor() {}

    public isChecked(val) {
        return this.activeList.some((item) => item === val);
    }

    public checkBtn(event) {
        if (event.target.checked && !this.activeList.some((item) => item === event.target.value)) {
            this.activeList.push(event.target.value);
        } else {
            let index = this.activeList.findIndex((item) => item === event.target.value);
            if (index >= 0) {
                this.activeList.splice(index, 1);
            }
        }
        
        this.propagateChange(this.activeList);
    }

    public writeValue(control) {
        if (control) {
            this.activeList = control;
        }
    }

    public propagateChange = (_: any) => {};

    public registerOnChange(fn) {
        this.propagateChange = fn;
    }

    public registerOnTouched() {}
}
