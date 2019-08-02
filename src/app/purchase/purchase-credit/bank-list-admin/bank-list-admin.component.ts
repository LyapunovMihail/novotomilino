import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { ICreditSnippet } from '../../../../../serv-files/serv-modules/credit-api/credit.interfaces';
import { PurchaseCreditService } from '../purchase-credit.service';
import { BANKS, Banks } from './banks';

@Component({
    selector: 'app-bank-list-admin',
    templateUrl: './bank-list-admin.component.html',
    styleUrls: [
        './bank-list-admin.component.scss'
    ],
    providers: [
        PurchaseCreditService
    ]
})

export class BankListAdminComponent implements OnInit {

    @Output() close = new EventEmitter();

    public banks: Banks[] = BANKS;

    public snippetArray: ICreditSnippet[] = [];

    constructor(
        private creditService: PurchaseCreditService
    ) { }

    ngOnInit() {
        this.creditService.getAllSnippet().subscribe(
            (data) => {
                this.snippetArray = data;

                if (this.snippetArray.length) {
                    return;
                }
                this.creditService.setSnippet(this.banks).subscribe(
                    (snippets) => {this.snippetArray = snippets; console.log('this.snippetArray: ', this.snippetArray); },
                    (error) => console.error(error)
                );
            },
            (error) => {
                console.error(error);
            }
        );
    }

    public updateSnippet(id, key, value) {
        this.creditService.updateSnippet(id, key, value).subscribe(
            (data) => {console.log('data: ', data)},
            (error) => console.error(error)
        );
    }
}
