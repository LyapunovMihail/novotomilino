import { ActivatedRoute, Router } from '@angular/router';
import { Component, Input } from '@angular/core';
import { FloorCount } from '../floor-count';

@Component({
    selector: 'app-house-selector',
    templateUrl: './house-selector.component.html',
    styleUrls: ['./house-selector.component.scss']
})

export class HouseSelectorComponent {

    public floorCount = FloorCount;
    @Input() public houseNumber: number;
    @Input() public sectionNumber: number;
    @Input() public floorNumber: number;

    constructor(
        public router: Router,
        private activatedRoute: ActivatedRoute
    ) { }


    public houseNavigate(num) {
        if (this.floorCount[num]) {
            const lastFloor = this.floorCount[num][this.sectionNumber][0];
            if (lastFloor < this.floorNumber ) {
                this.floorNumber = lastFloor;
            }
        }

        this.router.navigate(['/flats/house/' + num + '/section/' + this.sectionNumber + '/floor/' + this.floorNumber],
            {queryParams: this.activatedRoute.snapshot.queryParams});
    }

}
