import { AboutDocumentationService } from './about-documentation.service';
import { FILEUPLOADS_UPLOADS_PATH } from '../../../../serv-files/serv-modules/fileuploads-api/fileuploads.interfaces';
import { IDocumentationItem, IDocumentationDescription } from '../../../../serv-files/serv-modules/documentation-api/documentation.interfaces';
import { AuthorizationObserverService } from '../../authorization/authorization.observer.service';
import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-about-documentation',
    templateUrl: './about-documentation.component.html',
    styleUrls: ['./about-documentation.component.scss'],
    providers: [
        AboutDocumentationService
    ]
})
export class AboutDocumentationComponent implements OnInit {

    public AuthorizationEvent: Subscription;
    public isAuthorizated: boolean;
    public objectsList;
    public uploadsPath: string = FILEUPLOADS_UPLOADS_PATH;
    public description: string;

    constructor(
        private authorization: AuthorizationObserverService,
        private docsService: AboutDocumentationService
    ) { }

    public ngOnInit() {
        this.AuthorizationEvent = this.authorization.getAuthorization().subscribe( (val) => {
            this.isAuthorizated = val;
        });
        this.getObjects();
        this.getHeaderDescription();
    }

    public getHeaderDescription() {
        this.docsService.getHeaderDescription.subscribe((data: IDocumentationDescription) => {
            this.description = data.description;
        });
    }

    private getObjects() {
        this.docsService.getObjects.subscribe((data: IDocumentationItem[]) => {
            this.objectsList = data;
        }, (err) => {
            console.log(err);
        });
    }

}
