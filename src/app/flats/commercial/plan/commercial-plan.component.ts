import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { IAddressItemFlat } from '../../../../../serv-files/serv-modules/addresses-api/addresses.interfaces';
import { IHousePlanItem, PLAN_SVG } from '../../plan/plan-svg';
import { CommercialService } from '../commercial.service';

@Component({
    selector: 'app-commercial-plan',
    templateUrl: 'commercial-plan.component.html',
    styleUrls: ['./commercial-plan.component.scss'],
    providers: [
        CommercialService
    ]
})

export class CommercialPlanComponent implements OnInit {

    public houses: IHousePlanItem[] = PLAN_SVG;
    public activeLink = '';
    public allflats;

    constructor(
        public commercialService: CommercialService,
        public router: Router
    ) { }

    ngOnInit() {

        combineLatest(
            this.commercialService.getHouse(1),
            this.commercialService.getHouse(2),
            this.commercialService.getHouse(3),
            this.commercialService.getHouse(9),
        ).subscribe(([houseOne, houseTwo, houseThree, houseFour]) => {
            this.buildHousesData(0, houseOne);
            this.buildHousesData(1, houseTwo);
            this.buildHousesData(2, houseThree);
            this.buildHousesData(3, houseFour);
        });
    }

    private buildHousesData(i, flats) {
        flats = flats.filter((flat: IAddressItemFlat) => flat.status === '4');
        this.allflats = flats;
        this.houses[i].freeFlats = flats.length;
        if (flats.length) {
            this.houses[i].rooms.forEach((room)  => {
                room.minPrice = flats.filter((flat) => flat.rooms === room.name)
                    .reduce((minPrice, flat) => {
                        return flat.price < minPrice ? flat.price : minPrice;
                    }, 9999999999);
                room.minPrice = room.minPrice === 9999999999 ? 0 : Number((room.minPrice / 1000000).toFixed(2));
            });
        }
    }
    public svgRouterLink(event: Event, url) {
        if (event) {
            event.preventDefault();
        }
        this.router.navigate([`/flats/commercial/house/${url}/section/1/floor/1`]);
    }
    private getMinFloor(house) {
        return Math.min( ...this.allflats.filter(el => el.house === house).map(el => el.floor));
    }
}
