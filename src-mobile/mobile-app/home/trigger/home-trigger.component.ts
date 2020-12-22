import { Component, OnInit } from '@angular/core';
import { IAddressItemFlat } from '../../../../serv-files/serv-modules/addresses-api/addresses.interfaces';
import { FlatsService } from '../../flats/flats.service';
import { NavigationExtras, Router } from '@angular/router';

interface ITriggerSnippet {
    rooms: number;
    space: string;
    price: number;
}

@Component({
    selector: 'app-home-trigger',
    templateUrl: 'home-trigger.component.html',
    styleUrls: ['home-trigger.component.scss'],
    providers: [
        FlatsService
    ]
})

export class HomeTriggerComponent implements OnInit {

    public triggersData: ITriggerSnippet[] = [];
    public flats: IAddressItemFlat[] = [];

    constructor(
        public flatsService: FlatsService,
        public router: Router
    ) { }

    ngOnInit() {
        this.flatsService.getObjects({})
            .subscribe((data) => {
                this.flats = data.flats;
                this.buildTriggersData(data.flats.filter(el => el.type === 'КВ'));
            });
    }

    private buildTriggersData(flats) {
        flats = flats.filter((flat: IAddressItemFlat) => flat.status === '4');
        if (flats.length) {
            for (let i = 0; i < 4; i++) {
                const filteredFlats = flats.filter((flat) => {
                    switch (i) {
                        case 0:
                            return (flat.rooms === i && !this.getIsEuro(flat))
                                || flat.rooms === 1 && this.getIsEuro(flat);
                        case 1:
                            return (flat.rooms === i && !this.getIsEuro(flat))
                                || flat.rooms === 2 && this.getIsEuro(flat);
                        case 2:
                            return (flat.rooms === i && !this.getIsEuro(flat))
                                || (flat.rooms === 3 && this.getIsEuro(flat));
                        case 3:
                            return (flat.rooms === i && !this.getIsEuro(flat))
                                || flat.rooms === 4;
                    }
                });
                // console.log({ i, flats: filteredFlats.map(el => ({ rooms: el.rooms, euro: el.isEuro })) });

                if (filteredFlats.length) {
                    this.triggersData[i] = {rooms: i, space: '', price: 0};
                    this.triggersData[i].price = filteredFlats.reduce((minPrice, flat) => {
                            return flat.price < minPrice ? flat.price : minPrice;
                        }, 9999999999);
                    this.triggersData[i].price = Number((this.triggersData[i].price / 1000000).toFixed(2));

                    let spaceMin = filteredFlats.reduce((minSpace, flat) => {
                            return flat.space < minSpace ? flat.space : minSpace;
                        }, 9999999999);
                    spaceMin =  Math.round(spaceMin);

                    let spaceMax = filteredFlats.reduce((maxSpace, flat) => {
                        return flat.space > maxSpace ? flat.space : maxSpace;
                    }, 0);
                    spaceMax =  Math.round(spaceMax);

                    this.triggersData[i].space = spaceMin + '-' + spaceMax + ' м²';
                } else {
                    this.triggersData[i] = null;
                }
            }

        }
    }
    private getIsEuro(flat) { return flat.isEuro === '1'; }

    navigate(rooms) {
        const navigationExtras: NavigationExtras = {
            queryParams: { rooms: (rooms === 3 ? '3,4' : rooms), status: '4' }
        };

        this.router.navigate(['/flats/search'], navigationExtras);
    }
    public getPriceByMod(mod) {
        if (!this.flats.length
            || !(this.flats.filter(el => el.type === mod)).length) { return null; }

        const objects = this.flats.filter(el => el.type === mod);
        return Number(Math.min(...objects.map(el => el.price)) / 1000000).toFixed(2);
    }
}
