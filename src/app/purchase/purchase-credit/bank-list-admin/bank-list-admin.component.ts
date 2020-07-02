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
    ) {
    }

    ngOnInit() {
        this.creditService.getAllSnippet().subscribe(
            (snippets) => {
                this.snippetArray = snippets;

                // if (this.snippetArray.length < this.banks.length) { this.updateBank(this.snippetArray); }
                if (!this.snippetArray.length || this.snippetArray.length < this.banks.length) { this.setBanks(); }
            },
            (err) => console.error(err)
        );
    }

    public updateBank(arr) {
        const snippetForUpdate = [];

        this.banks.forEach( (bank) => {
            if (arr.findIndex( item => bank.name === item.name) >= 0) { return; }

            snippetForUpdate.push(bank);
        });
        this.creditService.setSnippet(snippetForUpdate).subscribe(
            (snippets) => this.snippetArray = snippets,
            (error) => console.error(error)
        );
    }

    public setBanks() {
        this.creditService.setSnippet(this.banks).subscribe(
            (snippets) => this.snippetArray = snippets,
            (error) => console.error(error)
        );
    }

    public updateSnippet(id, key, value) {
        this.creditService.updateSnippet(id, key, value).subscribe(
            (data) => {
            },
            (error) => console.error(error)
        );
    }
}
