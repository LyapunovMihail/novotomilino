import { PurchaseInstallmentNumberPipe } from './purchase-installment.pipe';
import { PurchaseInstallmentService, FormParams } from './purchase-installment.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';

@Component ({
    selector: 'app-purchase-installment',
    templateUrl: './purchase-installment.component.html',
    styleUrls: ['./purchase-installment.component.scss'],
    providers: [
        PurchaseInstallmentNumberPipe
    ]
})

export class PurchaseInstallmentComponent implements OnInit {

    public percent: number = 0;

    public monthPay: number = 0;

    public isFullPay: boolean = false;

    public form: FormParams = {
        price: {
            val : 2000000,
            min : 2000000,
            max : 10000000
        },
        month: {
            val : 1,
            min : 1,
            max : 14
        },
        firstpay: {
            val : 0,
            min : 0,
            max : 0
        }
    };

    constructor (
        private bitNumber: PurchaseInstallmentNumberPipe,
        private srvc: PurchaseInstallmentService
    ) { }

    public ngOnInit ( ) {
        this.formConvert ( );
    }

    public formConvert ( ) {
        let values = this.srvc.values(this.form);

        // price
        if ( values.price.val < values.price.min ) {
            this.form.price.val = values.price.min;
        } else {
            this.form.price.val = values.price.val;
        }

        // firstpay rewrite values
        if ( values.firstpay.val <  values.price.val / 2 ) {
            this.form.firstpay.val = values.price.val / 2;
            this.isFullPay = false;
        } else if ( values.firstpay.val >= values.price.val ) {
            this.form.firstpay.val = values.price.val;
            this.isFullPay = true;
        } else {
            this.form.firstpay.val = values.firstpay.val;
            this.isFullPay = false;
        }
        this.form.firstpay.min = values.price.val / 2;
        this.form.firstpay.max = values.price.val;

        this.percent = this.srvc.getPercent( values.month.val );

        this.monthPay = this.getEveryMonth().toFixed(0);
    }

    public getEveryMonth() {

        // оставшаяся сумма за вычетом скидки и первоначального взноса
        let leftSum = (this.form.price.val - this.form.firstpay.val);

        // ежемесячная оплата
        let monthPrice;
        if ( this.percent > 0 ) {
            monthPrice = this.excelPMT(this.percent / (100 * 12), this.form.month.val, leftSum);
        }else {
            monthPrice = leftSum / this.form.month.val;
        }

        return (monthPrice);

    }

    public formChanges ( val, field ) {
        this.form[field]['val'] = val;
        this.formConvert ( );
    }

    public fullPayChange () {
        this.isFullPay = !this.isFullPay;
        let values = this.srvc.values(this.form);
        if ( this.isFullPay ) {
            this.form.firstpay.val = values.price.val;
        } else {
            this.form.firstpay.val = values.price.val / 2;
        }
    }

    // Эксель функция ПЛТ
    public excelPMT(
        rate /*(ставка) – процентная ставка.*/,
        number_of_periods /*(число_платежей) – количество запланированных платежей.*/,
        present_value /*(текущий_размер_выплат) – текущий размер ежегодных выплат.) */ ) {
        return (present_value * rate) / (1 - Math.pow((1 + rate), -number_of_periods));
    }

    /// format input's values
    public bitReplace( val, field ) {
        this.form[field].val = val;
    }

    public keyUpReviuse(e) {
        let value = e.target.value;
        let rep = /[-\.;":'a-zA-Zа-яА-Я]/;
        if (rep.test(value)) {
            value = value.replace(rep, '');
            e.target.value = value;
        }
    }
}
