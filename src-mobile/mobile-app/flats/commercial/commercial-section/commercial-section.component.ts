import { Component, OnInit } from '@angular/core';
import { CommercialService } from '../commercial.service';

@Component({
    selector: 'app-commercial-section',
    templateUrl: 'commercial-section.component.html',
    styleUrls: ['./commercial-section.component.scss'],
    providers: [
        CommercialService
    ]
})

export class CommercialSectionComponent implements OnInit {

    public flats;
    public sections: any = [];

    constructor(
        public commercialService: CommercialService
    ) { }

    ngOnInit() {
        this.getFlats();
    }

    private getFlats() {
        this.commercialService.getObjects({ type: 'КН' }).subscribe(
            data => {
                this.flats = data;
                this.buildSection();
            }
        );
    }
    private buildSection() {
        this.flats.forEach((flat) => {
            let house = this.sections.find((item) => item.house === flat.house);
            if (!house) {
                house = { house: flat.house, parks: [] };
                this.sections.push(house);
            }

            const match = house.parks.find((item) => item.section === flat.section && item.floor === flat.floor);
            if (match) {
                match.price = match.price < flat.price ? match.price : flat.price;
            } else {
                house.parks.push({ section: flat.section, floor: flat.floor, price: flat.price});
            }
        });

        this.sections.forEach((item) => {
            item.parks.sort((a, b) => a.floor - b.floor);
            item.parks.sort((a, b) => a.section - b.section);
        });
        this.sections.sort((a, b) => a.house - b.house);
    }
}
