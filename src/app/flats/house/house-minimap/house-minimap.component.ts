import { ActivatedRoute, Router } from '@angular/router';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FloorCount } from '../../floor/floor-count';
import { houses } from './house-list';
import { HouseService } from '../house.service';

@Component({
    selector: 'app-house-minimap',
    templateUrl: './house-minimap.component.html',
    styleUrls: ['./house-minimap.component.scss'],
    providers: [ HouseService ]
})

export class HouseMinimapComponent implements OnInit {

    public floorCount = FloorCount;
    public houseList = houses;
    public houseNumbers: string[];

    @Input() public houseNumber: string;
    @Output() public floorClicked = new EventEmitter();

    public activeList: any;

    constructor(
        public router: Router,
        private activatedRoute: ActivatedRoute,
        public houseService: HouseService
    ) { }

    public ngOnInit() {
        this.activeList = this.houseNumber;

        this.houseService.getObjects({}).subscribe( flats => {
            const houses = flats.map( flat => flat.house).filter( (item, i, arr) => arr.indexOf(item) === i );

            this.houseList.forEach( house => {
                if (houses.some( item => item === Number(house.house))) {
                    house.disabled = false;
                }
            });
        });
    }

    public checkBtn(ev) {
        const value = ev.target.value;
        const checked = ev.target.checked;

        if (checked && !this.activeList.some((item) => item === value)) {
            this.activeList.push(value);
        } else {
            const index = this.activeList.findIndex((item) => item === value);
            if (index >= 0 && this.activeList.length > 1) {
                this.activeList.splice(index, 1);
            } else { ev.target.checked = true; }
        }
        /* Выставля задержку, что бы успеть приминить изменения если выбирается несколько корпусов подряд */
        setTimeout(() => {
            this.houseNavigate(this.activeList);
        }, 1000);
    }

    public houseNavigate(num) {
        const queryParams = {...this.activatedRoute.snapshot.queryParams};
        queryParams.houses = num.length > 0 ? num.join(',') : num;
        this.router.navigate(['/flats/house'], {queryParams});
    }
}
