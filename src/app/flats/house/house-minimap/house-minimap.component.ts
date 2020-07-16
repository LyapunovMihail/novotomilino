import { ActivatedRoute, Router } from '@angular/router';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FloorCount } from '../../floor/floor-count';
import { houses } from './house-list';
import { HouseService } from '../house.service';

@Component({
    selector: 'app-house-minimap',
    templateUrl: './house-minimap.component.html',
    styleUrls: ['./house-minimap.component.scss'],
    providers: [ HouseService ]
})

export class HouseMinimapComponent implements OnInit, OnChanges {

    public floorCount = FloorCount;
    public houseList = houses;
    public houseNumbers: string[];
    @Input() public houseNumber: string;

    constructor(
        public router: Router,
        private activatedRoute: ActivatedRoute,
        public houseService: HouseService
    ) { }

    public ngOnInit() {
        this.houseNumbers = Object.keys(this.floorCount);

        this.houseService.getObjects({}).subscribe( flats => {
            const houses = flats.map( flat => flat.house).filter( (item, i, arr) => arr.indexOf(item) === i );

            this.houseList.forEach( house => {
                if (houses.some( item => item === Number(house.house))) {
                    house.disabled = false;
                }
            });
        })
    }

    public ngOnChanges() {
        // Даём время прогрузиться компонентам поиска по параметрам чтобы они успели подписаться на событие смены queryparams и учли корпус выбранный при загрузке страницы дома
        setTimeout(() => {
            this.houseNavigate(this.houseNumber);
        }, 100);
    }

    public houseNavigate(num) {
        const queryParams = {...this.activatedRoute.snapshot.queryParams};
        queryParams.houses = num;
        this.router.navigate(['/flats/house/' + num], {queryParams});
    }
}
