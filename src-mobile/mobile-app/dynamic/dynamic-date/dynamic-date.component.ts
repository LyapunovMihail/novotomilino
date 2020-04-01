import { IDynamicObject } from '../../../../serv-files/serv-modules/dynamic-api/dynamic.interfaces';
import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';

@Component({
    selector: 'app-dynamic-date',
    templateUrl: './dynamic-date.component.html',
    styleUrls: ['./dynamic-date.component.scss']
})

export class DynamicDateComponent implements OnInit, OnChanges {

    @Input() month: number;
    @Input() year: number;
    @Input() objectsArray: IDynamicObject[] = [];

    // @Output() monthChange: EventEmitter<number> = new EventEmitter();
    // @Output() yearChange: EventEmitter<number> = new EventEmitter();
    @Output() dateChange: EventEmitter<any> = new EventEmitter();

    public date = new Date();
    public tooltipYear = false;
    public tooltipOpen = false;

    public realYear: number = Number(this.date.getFullYear());
    public realMonth: number = Number(this.date.getMonth()) + 1;

    public monthArray: any[] = [
        {
            name: 'Январь',
            value: 1,
            disabled: false
        }, {
            name: 'Февраль',
            value: 2,
            disabled: false
        }, {
            name: 'Март',
            value: 3,
            disabled: false
        }, {
            name: 'Апрель',
            value: 4,
            disabled: false
        }, {
            name: 'Май',
            value: 5,
            disabled: false
        }, {
            name: 'Июнь',
            value: 6,
            disabled: false
        }, {
            name: 'Июль',
            value: 7,
            disabled: false
        }, {
            name: 'Август',
            value: 8,
            disabled: false
        }, {
            name: 'Сентябрь',
            value: 9,
            disabled: false
        }, {
            name: 'Октябрь',
            value: 10,
            disabled: false
        }, {
            name: 'Ноябрь',
            value: 11,
            disabled: false
        }, {
            name: 'Декабрь',
            value: 12,
            disabled: false
        }
    ];

    public yearsArray: number[] = [];

    constructor(
        public ref: ChangeDetectorRef
    ) {}

    ngOnInit() {
        this.yearsArray = this.yearsArrayGenerate();
        this.ref.detectChanges();
    }

    ngOnChanges(changes: SimpleChanges) {
        this.ref.detectChanges();

        if ('year' in changes) {
            this.afterChangeYear();
        }
    }

    public testMonth(month, year) {
        return !this.objectsArray.some( (obj) => {
            // console.log( (obj.year === year && obj.month === month) )
            return ( (obj.year === year && obj.month === month) ); 
        });
    }

    test(ev) {
        console.log('month', ev.target.value);
        // console.log('year', ev.target.name);
        console.log('year', ev);

        const arr = ev.target.value.split(';');
        this.changeDate(arr[0], arr[1]);
    }

    public afterChangeYear() {
        let month = 1;
        if (this.monthArray.find((item) => item.value === this.month).disabled) {
            this.monthArray.forEach((item, i) => {
                if (!item.disabled) {
                    month = item.value;
                }
                if (i === this.monthArray.length - 1) {
                    this.changeDate(month, this.year);
                }
            });
        }
    }

    private yearsArrayGenerate(): number[] {
        let from = 2019;
        let to = Number(this.date.getFullYear());
        let result = [];
        for ( let i = from ; i <= to ; i ++ ) {
            result.push(i);
        }
        return result;
    }

    public getMonthName(i) {
        return this.monthArray.find((item) => item.value === i).name;
    }

    public changeDate(month, year) {
        const date = {
            month,
            year
        };
        this.dateChange.emit(date);
    }
}
