import { ICreditSnippet, CREDIT_UPLOADS_PATH } from '../../../../serv-files/serv-modules/credit-api/credit.interfaces';
import { PurchaseCreditService } from './purchase-credit.service';
import { AuthorizationObserverService } from './../../authorization/authorization.observer.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
    selector: 'app-purchase-credit',
    templateUrl: './purchase-credit.component.html',
    styleUrls: ['./../purchase.component.scss'],
    providers: [
        PurchaseCreditService
    ]
})

export class PurchaseCreditComponent implements OnInit, OnDestroy {

    public isAuthorizated: boolean = false;

    public snippetArray: ICreditSnippet[] = [];

    public uploadsPath: string = `/${CREDIT_UPLOADS_PATH}`;

    public AuthorizationEvent;

    constructor(
        private authorization: AuthorizationObserverService,
        private service: PurchaseCreditService
    ) { }

    public ngOnInit() {
        this.AuthorizationEvent = this.authorization.getAuthorization().subscribe( (val) => this.isAuthorizated = val );
        this.service.getSnippet().subscribe(
            (data) => this.snippetArray = data,
            (error) => {
                console.error(error);
            }
        );
    }

    public ngOnDestroy() {
        this.AuthorizationEvent.unsubscribe();
    }
}
