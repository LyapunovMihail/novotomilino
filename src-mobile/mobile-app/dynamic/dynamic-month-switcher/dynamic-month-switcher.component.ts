import { Component, Input, EventEmitter, Output, OnChanges } from '@angular/core';
import { IDynamicObject } from '../../../../serv-files/serv-modules/dynamic-api/dynamic.interfaces';

@Component({
    selector: 'app-dynamic-month-switcher',
    templateUrl: './dynamic-month-switcher.component.html',
    styleUrls: ['./dynamic-month-switcher.component.scss']
})

export class DynamicMonthSwitcherComponent implements OnChanges {

    @Input() month = 0;
    @Input() year = 0;
    @Input() objectsArray: IDynamicObject[] = [];

    @Output() monthChange: EventEmitter<number> = new EventEmitter();
    @Output() yearChange: EventEmitter<number> = new EventEmitter();

    public prevBtn: string;
    public nextBtn: string;
    public isValidPrevMonth: boolean;
    public isValidNextMonth: boolean;

    public date = new Date();

    public realYear = Number(this.date.getFullYear());
    public realMonth = Number(this.date.getMonth()) + 1;

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

    public ngOnChanges() {
        this.prevBtn = (this.month === 1) ? this.monthArray[11] : this.monthArray[this.month - 2];
        this.nextBtn = (this.month === 12) ? this.monthArray[0] : this.monthArray[this.month];

        this.checkPrevMonth();
        this.checkNextMonth();
    }

    public checkPrevMonth() {
        const prevMonth = this.month === 1 ? 12 : this.month - 1;
        const year = this.month === 1 ? this.year - 1 : this.year;
        // Проверяем совпадает ли хоть один объект из массива значению месяца и выбранного года
        this.isValidPrevMonth = this.objectsArray.some((obj) => {
            return (obj.year === year && obj.month === prevMonth);
        });
    }

    public checkNextMonth() {
        const nextMonth = this.month === 12 ? 1 : this.month + 1;
        const year = this.month === 12 ? this.year + 1 : this.year;
        // Проверяем совпадает ли хоть один объект из массива значению месяца и выбранного года
        this.isValidNextMonth = this.objectsArray.some((obj) => {
            return (obj.year === year && obj.month === nextMonth);
        });
    }

    public toPrevMonth() {
        const month = this.month;
        if (month === 1) {
            this.yearChange.emit(this.year - 1);
        }
        setTimeout(() => {
            this.monthChange.emit(((month === 1) ? 12 : month - 1));
        }, 20);
    }

    public toNextMonth() {
        const month = this.month;
        if (month === 12) {
            this.yearChange.emit(this.year + 1);
        }
        setTimeout(() => {
            this.monthChange.emit(((month === 12) ? 1 : month + 1));
        }, 20);
    }

}
