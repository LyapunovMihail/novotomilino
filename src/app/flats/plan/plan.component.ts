import { Router } from '@angular/router';
import { SearchFlatsLinkHandlerService } from '../../commons/searchFlatsLinkHandler.service';
import { PLAN_SVG, IHousePlanItem } from './plan-svg';
import { PlanService } from './plan.service';
import { Component, OnInit } from '@angular/core';
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

    public showSearchWindow = false;
    public showPopular = false;
    public houses: IHousePlanItem[] = PLAN_SVG;
    public activeLink = '';
    public metaTags;

    public infoAboutSect: IHousePlanItem;
    public coord;

    constructor(
        public router: Router,
        private planService: PlanService,
        private searchFlatsLinkHandlerService: SearchFlatsLinkHandlerService,
    ) {}

    ngOnInit() {
        this.searchFlatsLinkHandlerService.getShowSearchPanel().subscribe((show) => {
            this.showSearchWindow = show;
        });

        combineLatest(
            this.planService.getHouse(1),
            this.planService.getHouse(2),
            this.planService.getHouse(3),
            this.planService.getHouse(9)
        ).subscribe(([houseOne, houseTwo, houseThree, houseNine]) => {
            this.buildHousesData(0, houseOne);
            this.buildHousesData(1, houseTwo);
            this.buildHousesData(2, houseThree);
            this.buildHousesData(3, houseNine);
        });
    }

    private buildHousesData(i, flats) {
        this.houses[i].freeFlats = flats.length;
        if (flats.length) {
            this.houses[i].rooms.forEach((room)  => {
                // RED3-705: При ховере на корпус должны выводится мин.цены только по квартирам в продаже
                room.minPrice = flats.filter((flat) => flat.rooms === room.name && flat.status === '4')
                    .reduce((minPrice, flat) => {
                        return flat.price < minPrice ? flat.price : minPrice;
                    }, 9999999999);
                room.minPrice = room.minPrice === 9999999999 ? 0 : Number((room.minPrice / 1000000).toFixed(2));
            });
        }
    }

    public svgRouterLink(event: Event, house) {
        if (event) {
            event.preventDefault();
        }
        this.router.navigate(['/flats/house/'], {queryParams: {houses: house}});
    }
    public onmouseenter(house) {
        this.infoAboutSect = house;
    }
    public onclick() {
        if (this.showSearchWindow) {
            this.showSearchWindow = false;
        }
    }
    public onMousemove(ev: MouseEvent, parent: HTMLElement) {
        if (!this.infoAboutSect || this.showSearchWindow) { return; }
        const elem = document.querySelector('.plan__tooltip');
        const tooltip = elem ? { width: elem.clientWidth, height: elem.clientHeight } : { width: 0, height: 0 };
        const jparent = { width: parent.clientWidth, height: parent.clientHeight }
        this.coord = {
            x: ev.clientX,
            y: ev.clientY,
            posX: ev.clientX + tooltip.width > jparent.width
                ? -tooltip.width - 20
                : 20,
            posY: ev.clientY + tooltip.height > jparent.height
                ? -tooltip.height
                : -80,
        }
    }
}
