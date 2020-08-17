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

    constructor(
        private platform: PlatformDetectService,
        public searchService: SearchService,
        private searchFlatsLinkHandlerService: SearchFlatsLinkHandlerService
    ) { }

    ngOnInit() {
        this.searchService.getObjects({})
            .subscribe((flats) => {
                this.buildTriggersData(flats);
            });
    }

    private buildTriggersData(flats) {
        flats = flats.filter((flat: IAddressItemFlat) => flat.status === '4');
        if (flats.length) {
            for (let i = 0; i < 4; i++) {
                const filteredFlats = flats.filter((flat) => {
                    if ((i === 1 || i === 2) && flat.rooms === 2 && flat.space < 34) { return flat; } // 2к кв площадь которых < 34м = 1комн и 2комн
                    if (i === 2 && flat.rooms === 2 && flat.space > 34) { return flat; }              // 2к кв площадь которых > 34м = 2комн
                    if ((i === 1 || i === 2) && flat.rooms === 1 && flat.space < 41) { return flat; } // 1к кв площадь которых < 41м = 1комн и 2комн
                    if (i === 2 && flat.rooms === 1 && flat.space >= 41) { return flat; }             // 1к кв площадь которых >= 41м = 2комн
                    if (flat.rooms === i) { return flat; }
                });
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
            }

        }
    }

    public navigate(rooms) {
        this.searchFlatsLinkHandlerService.linkHandle(true, { rooms, status: '4' });
    }
}
