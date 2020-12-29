import { Component, forwardRef, Input, EventEmitter, Output } from '@angular/core';
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

    @Input() public parentPlan;
    @Input() public name: string;
    @Input() public btnList: any[] = [];
    @Output() public close = new EventEmitter<boolean>();

    public activeList: any[] = [];

    constructor() {}

    // Скрываем дома в которых нет квартир
    public get checkboxList() { return this.btnList.filter( house => !house.disabled); }

    public isChecked(val) {
        if (val === 'all') { return this.isCheckedAll; }
        return this.activeList.some((item) => item === val);
    }

    // Если проверяется состояние чекбокса 'выбрать всё' - проверяем равен ли массив значений кол-ву не заблокированных чекбоксов,
    // или массив значений пуст
    // то возвращаем true, если нет - false.
    public get isCheckedAll(): boolean {
        return !this.activeList.length || (this.activeList.length === this.btnList.filter( house => !house.disabled).length - 1);
    }

    public checkBtn(event) {
        const value = event.target.value;

        if (this.name === 'houses') {
            this.checkHouses(event, value);
        } else {
            this.checkOtherCtrls(event, value);
        }
    }

    public writeValue(control) {
        if (control) {
            this.activeList = control;
        }
    }
    public propagateChange = (_: any) => {};
    public registerOnChange(fn) { this.propagateChange = fn; }
    public registerOnTouched() {}

    private checkHouses(ev, value) {
        const checked = ev.target.checked;
        const inList = this.activeList.some((item) => item === value);
        const allHouses = this.btnList.filter( house => !house.disabled && house.value !== 'all').map(el => el.value);

        /*  RED3-736: ->
                При формировании формы массив домов приходит пустой,
                и в этом случае чекбокс "Все корпуса" активен, при первом нажатии на любой доступный корпус
                он деактивируется, а чекбокс корпуса активируется. Если мы выберем все корпуса щелкая на каждый из них,
                или нажав на "Все корпуса", то все чекбоксы деактивируются, а "Все корпуса" - активируется. 
                И в момент активации в форму отдается заполненый массив домов
        */

        if (value === 'all') {
            if (!this.isCheckedAll) {
                this.activeList = allHouses;
            } else {
                ev.target.checked = true;
                return;
            }
            this.propagateChange(this.activeList);
            return;
        }

        if (this.isCheckedAll && checked) {
            this.activeList = [ value ];
            this.propagateChange(this.activeList);
            return;
        }

        if (checked && !inList) {
            this.activeList.push(value);
            if (this.isCheckedAll) {
                this.activeList = allHouses;
                ev.target.checked = false;
            }
        } else {
            const index = this.activeList.findIndex((item) => item === value);
            if (this.parentPlan) {
                this.activeList.splice(index, 1);
            } else {
                if (index === 0 && this.activeList.length === 1) {
                    ev.target.checked = true;
                    return;
                }
                if (index >= 0 && this.activeList.length > 1) { this.activeList.splice(index, 1); }
            }
        }

        this.propagateChange(this.activeList);
    }
    private checkOtherCtrls(ev, value) {
        const checked = ev.target.checked;
        const inList = this.activeList.some((item) => item === value);

        if (checked && !inList) {
            this.activeList.push(value);
        } else {
            const index = this.activeList.findIndex((item) => item === value);
            this.activeList.splice(index, 1);
        }

        this.propagateChange(this.activeList);
    }
}

