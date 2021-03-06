import { Component, OnInit } from '@angular/core';
import { IAddressItemFlat } from '../../../../serv-files/serv-modules/addresses-api/addresses.interfaces';
import { SearchFlatsLinkHandlerService } from '../../commons/searchFlatsLinkHandler.service';
import { SearchService } from '../../flats/search/search.service';
import { PlatformDetectService } from '../../platform-detect.service';

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
        SearchService
    ]
})

export class HomeTriggerComponent implements OnInit {

    public triggersData: ITriggerSnippet[] = [];
    public flats: IAddressItemFlat[] = [];

    constructor(
        private platform: PlatformDetectService,
        public searchService: SearchService,
        private searchFlatsLinkHandlerService: SearchFlatsLinkHandlerService
    ) { }

    ngOnInit() {
        this.searchService.getObjects({ status: '4' })
            .subscribe((flats) => {
                this.flats = flats;
                this.buildTriggersData(flats.filter(el => el.type === 'КВ'));
            });
    }

    private buildTriggersData(flats) {
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
                    this.triggersData[i] = { rooms: i, space: '', price: 0 };
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

    public navigate(rooms) {
        this.searchFlatsLinkHandlerService.linkHandle(true, { rooms: (rooms === 3 ? '3,4' : rooms), status: '4' });
    }

    public getPriceByMod(mod) {
        if (!this.flats.length
            || !(this.flats.filter(el => el.type === mod)).length) { return null; }

        const objects = this.flats.filter(el => el.type === mod);
        return Number(Math.min(...objects.map(el => el.price)) / 1000000).toFixed(2);
    }
}
