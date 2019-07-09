import { Router } from '@angular/router';
import { PlatformDetectService } from './../../../platform-detect.service';
import { Component } from '@angular/core';

@Component({
    selector: 'app-house-side-bar',
    templateUrl: './house-side-bar.component.html',
    styleUrls: ['./house-side-bar.component.scss']
})

export class HouseSideBarComponent {

    constructor(
        public router: Router,
        public platform: PlatformDetectService
    ) { }

    public writePreviousUrl() {
        if (this.platform.isBrowser) {
            localStorage.setItem('previousRoute', this.router.url);
            this.router.navigate(['/flats/search']);
        }
    }

}
