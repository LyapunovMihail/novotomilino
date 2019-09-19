import { ActivatedRoute, Router } from '@angular/router';
import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-house-sidebar',
    templateUrl: './house-sidebar.component.html',
    styleUrls: ['./house-sidebar.component.scss']
})

export class HouseSidebarComponent {

    @Input() public houseNumber: number;
    @Input() public sectionNumber: number;
    @Input() public sectionSelector: string[];

    constructor(
        public router: Router,
        public activatedRoute: ActivatedRoute
    ) { }

    public houseNavigate(num) {
        this.router.navigate(['/flats/house/' + num + '/section/' + this.sectionNumber], {queryParams: this.activatedRoute.snapshot.queryParams});
    }
}
