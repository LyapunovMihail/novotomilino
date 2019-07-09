import { Uploader } from 'angular2-http-file-upload';
import { PurchaseCreditUpload } from './purchase-credit.upload';
import { ICreditSnippet, CREDIT_UPLOADS_PATH } from '../../../../serv-files/serv-modules/credit-api/credit.interfaces';
import { PurchaseCreditService } from './purchase-credit.service';
import { AuthorizationObserverService } from './../../authorization/authorization.observer.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
    selector: 'app-purchase-credit',
    templateUrl: './purchase-credit.component.html',
    styleUrls: ['./../purchase.component.scss', './purchase-credit.admin.scss'],
    providers: [
        PurchaseCreditService,
        Uploader
    ]
})

export class PurchaseCreditComponent implements OnInit, OnDestroy {

    public isAuthorizated: boolean = false;

    public snippetArray: ICreditSnippet[] = [];

    public uploadsPath: string = `/${CREDIT_UPLOADS_PATH}`;

    public AuthorizationEvent;

    constructor(
        private authorization: AuthorizationObserverService,
        private service: PurchaseCreditService,
        private  uploaderService: Uploader
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

    public setSnippet() {
        this.service.setSnippet().subscribe(
            (data) => this.snippetArray = data,
            (error) => console.error(error)
        );
    }

    public deleteSnippet(id) {
        this.service.deleteSnippet(id).subscribe(
            (data) => this.snippetArray = data,
            (error) => console.error(error)
        );
    }

    public updateSnippet(id, key, value) {
        if ( this.isAuthorizated ) {
            this.service.updateSnippet(id, key, value).subscribe(
                (data) => this.snippetArray = data,
                (error) => console.error(error)
            );
        }
    }

    public uploadSnippet(e, id) {
        let fileList: FileList = e.target.files;
        let uploadFile: File = fileList[0];

        let myUploadItem = new PurchaseCreditUpload(uploadFile, id);
        myUploadItem.formData = { FormDataKey: 'Form Data Value' };

        this.uploaderService.onSuccessUpload = (item, response, status, headers) => {
            this.snippetArray = response;
        };
        this.uploaderService.onErrorUpload = (item, response, status, headers) => {
            console.error(response);
        };
        this.uploaderService.onCompleteUpload = (item, response, status, headers) => {};
        this.uploaderService.onProgressUpload = (item, percentComplete) => {};
        this.uploaderService.upload(myUploadItem);
    }

}
