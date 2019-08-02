import { ICreditSnippet } from '../../../../serv-files/serv-modules/credit-api/credit.interfaces';
import { PurchaseCreditService } from './purchase-credit.service';
import { AuthorizationObserverService } from './../../authorization/authorization.observer.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { WindowScrollLocker } from '../../commons/window-scroll-block';

@Component({
    selector: 'app-purchase-credit',
    templateUrl: './purchase-credit.component.html',
    styleUrls: ['./purchase-credit.scss', './purchase-credit.admin.scss'],
    providers: [
        WindowScrollLocker,
        PurchaseCreditService,
    ]
})

export class PurchaseCreditComponent implements OnInit, OnDestroy {

    public isAuthorizated = false;

    public snippetArray: ICreditSnippet[] = [];

    public AuthorizationEvent;

    public showModalBankList = false;

    public params: any;
    public form: any;

    constructor(
        private windowScrollLocker: WindowScrollLocker,
        private authorization: AuthorizationObserverService,
        private creditService: PurchaseCreditService
    ) { }

    public ngOnInit() {
        this.AuthorizationEvent = this.authorization.getAuthorization()
            .subscribe( (val) => {
                this.isAuthorizated = val;
                if (this.isAuthorizated) {
                    this.getActiveSnippet();
                } else {
                    this.getActiveSnippet(this.params);
                }
            });


    }

    public ngOnDestroy() {
        this.AuthorizationEvent.unsubscribe();
    }

    public getActiveSnippet(params?) {
        if (params) {
            this.creditService.getActiveSnippetWithParams(params).subscribe(
                (data) => {
                    console.log('this.snippetArray: ', data);
                    this.snippetArray = data;
                    this.creditService.calculateMonthPay(this.form, this.snippetArray);
                },
                (error) => {
                    console.error(error);
                }
            );
        } else {
            this.creditService.getActiveSnippet().subscribe(
                (data) => {
                    console.log('this.snippetArray: ', data);
                    this.snippetArray = data;
                },
                (error) => {
                    console.error(error);
                }
            );
        }
    }

    public deleteSnippet(id) {
        this.creditService.deleteSnippet(id).subscribe(
            (data) => this.snippetArray = data,
            (error) => console.error(error)
        );
    }

    public updateSnippet(id, key, value) {
        if ( this.isAuthorizated ) {
            if (key === 'initial' || key === 'percent' || key === 'deadline') {
                value = Number(value);
            }
            console.log('value: ', value);
            this.creditService.updateSnippet(id, key, value).subscribe(
                (data) => this.snippetArray = data,
                (error) => console.error(error)
            );
        }
    }

    public formChange(form) {

        const params = {
            initial: (Math.round((form.firstpay.val / form.price.val) * 100)), // Подсчет минимального взноса в % (первый платёж поделённый на цену квартиры)
            deadline: form.deadline.val,
            military: form.military,
            maternal: form.maternal,
            nationality: form.nationality
        };

        this.form = form; // для подсчета monthPay
        this.params = params;

        console.log('params: ', params);
        this.getActiveSnippet(params);
    }

}
