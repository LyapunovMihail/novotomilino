import { ActivatedRoute, Router } from '@angular/router';
import { Component, Input, OnChanges } from '@angular/core';
import { FloorCount } from '../../floor/floor-count';

@Component({
    selector: 'app-house-minimap',
    templateUrl: './house-minimap.component.html',
    styleUrls: ['./house-minimap.component.scss']
})

export class HouseMinimapComponent implements OnChanges {

    public floorCount = FloorCount;
    @Input() public houseNumber: string;
    @Input() public sectionNumber: string;

    constructor(
        public router: Router,
        private activatedRoute: ActivatedRoute
    ) { }

    public ngOnChanges() {
        // Даём время прогрузиться компонентам поиска по параметрам чтобы они успели подписаться на событие смены queryparams и учли корпус выбранный при загрузке страницы дома
        setTimeout(() => {
            this.houseNavigate(this.houseNumber);
        }, 100);
    }

    public houseNavigate(num) {
        // Проверяем есть ли в схеме дома, на который мы хотим перейти, такая секция
        let section = Object.keys(this.floorCount[num]).pop();
        if (section > this.sectionNumber) {
            section = this.sectionNumber;
        }

        const queryParams = {...this.activatedRoute.snapshot.queryParams};
        queryParams.houses = num;

        this.router.navigate(['/flats/house/' + num + '/section/' + section], {queryParams});
    }
}
