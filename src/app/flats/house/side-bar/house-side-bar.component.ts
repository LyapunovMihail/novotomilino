import { ActivatedRoute, Router } from '@angular/router';
import { PlatformDetectService } from './../../../platform-detect.service';
import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-house-side-bar',
    templateUrl: './house-side-bar.component.html',
    styleUrls: ['./house-side-bar.component.scss']
})

export class HouseSideBarComponent {

    @Input() public houseNumber: string;
    @Input() public sectionNumber: string;

    constructor(
        public router: Router,
        private activatedRoute: ActivatedRoute,
        public platform: PlatformDetectService
    ) { }


    public houseNavigate(num) {
        this.router.navigate(['/flats/house/' + num + '/section/' + this.sectionNumber], {queryParams: this.activatedRoute.snapshot.queryParams});
    }
}
