import { Component, OnInit } from '@angular/core';
import { HomeService } from '../home.service';
import { PlatformDetectService } from '../../platform-detect.service';
import { AuthorizationObserverService } from '../../authorization/authorization.observer.service';

@Component({
    selector: 'app-home-description',
    templateUrl: './home-description.component.html',
    styleUrls: [
        './home-description.component.scss'
    ]
})

export class HomeDescriptionComponent implements OnInit {

    public description;
    public isAuthorizated: boolean = false;
    public AuthorizationEvent;

    constructor(
        private homeService: HomeService,
        public platform: PlatformDetectService,
        private authorization: AuthorizationObserverService
    ) {}

    ngOnInit() {
        if ( !this.platform.isBrowser ) { return false; }

            this.AuthorizationEvent = this.authorization.getAuthorization().subscribe( (val) => {
            this.isAuthorizated = val;
        });

        this.homeService.getHeaderDescription().subscribe(
            data => this.description = data.description,
            error => console.log(error)
        );
    }

    public updateDescription(text) {
        this.homeService.updateHeaderDescription(text).subscribe(
            data => this.description = data.description
        );
    }

}
