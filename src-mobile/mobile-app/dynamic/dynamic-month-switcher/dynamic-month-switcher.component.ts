import { Component, Input, EventEmitter, Output, OnChanges } from '@angular/core';

@Component({
    selector: 'app-dynamic-month-switcher',
    templateUrl: './dynamic-month-switcher.component.html',
    styleUrls: ['./dynamic-month-switcher.component.scss']
})

export class DynamicMonthSwitcher implements OnChanges {

    @Input() month: number = 0;
    @Input() year: number = 0;

    @Output() monthChange: EventEmitter<number> = new EventEmitter();
    @Output() yearChange: EventEmitter<number> = new EventEmitter();

    public prevBtn: string;
    public nextBtn: string;

    public date = new Date();

    public realYear = Number(this.date.getFullYear());
    public realMonth = Number(this.date.getMonth());

    public monthArray: string[] = [
        'Январь',
        'Февраль',
        'Март',
        'Апрель',
        'Май',
        'Июнь',
        'Июль',
        'Август',
        'Сентябрь',
        'Октябрь',
        'Ноябрь',
        'Декабрь'
    ];

    ngOnChanges() {
        this.prevBtn = (this.month === 1) ? this.monthArray[11] : this.monthArray[this.month - 2];
        this.nextBtn = (this.month === 12) ? this.monthArray[0] : this.monthArray[this.month];
    }

    prevMonth() {
        this.monthChange.emit(((this.month === 1) ? 12 : this.month - 1));
    }

    nextMonth() {
        this.monthChange.emit(((this.month === 12) ? 1 : this.month + 1));
    }

}
