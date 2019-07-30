import {
    Router
} from '@angular/router';
import {
    PLAN_SVG,
    IPlanSvgItem
} from './plan-svg';
import {
    PlanService
} from './plan.service';
import {
    Component,
    OnInit
} from '@angular/core';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { IAddressItemFlat } from '../../../../serv-files/serv-modules/addresses-api/addresses.interfaces';

@Component({
    selector: 'app-flats-plan-page',
    templateUrl: './plan.component.html',
    styleUrls: ['./plan.component.scss', '../flats.component.scss'],
    providers: [
        PlanService
    ]
})

export class PlanComponent implements OnInit {

    public housesPlanSvg: IPlanSvgItem[] = PLAN_SVG;
    public links: string[] = this.planService.links();
    public activeLink: string = '';
    public houseOneFreeFlats: number;
    public houseTwoFreeFlats: number;

    constructor(
        public router: Router,
        private planService: PlanService
    ) {}

    ngOnInit() {
        combineLatest(
            this.planService.getHouseOne(),
            this.planService.getHouseTwo()
        ).subscribe(([houseOne, houseTwo]) => {
            this.houseOneFreeFlats = houseOne.filter((flat: IAddressItemFlat) => flat.status === '4').length;
            this.houseTwoFreeFlats = houseTwo.filter((flat: IAddressItemFlat) => flat.status === '4').length;
        });
    }

    public svgRouterLink(event: Event, url) {
        if (event) {
            event.preventDefault();
        }
        this.router.navigate([url]);
    }
}
