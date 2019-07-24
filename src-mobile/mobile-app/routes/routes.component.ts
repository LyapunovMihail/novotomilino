import { PlatformDetectService } from './../platform-detect.service';
import { Component, OnInit } from '@angular/core';
declare let ymaps: any;

@Component({
    selector: 'app-routes',
    templateUrl: './routes.component.html',
    styleUrls: ['./routes.component.scss']
})

export class RoutesComponent implements OnInit {

    constructor(
        private platform: PlatformDetectService
    ) {}

    ngOnInit() {
        this.initMap();
    }

    initMap () {
        if (!this.platform.isBrowser) { return; }

        ymaps.ready( () => {
            let myMap = new ymaps.Map('map', {
                center: [55.686053, 37.896472],
                zoom: 15,
                controls: []
            }, {
                minZoom: 11,
                maxZoom: 18
            });

            let marker = new ymaps.Placemark([55.684853, 37.896472], {
                iconContent: '<div class="main_map_marker"></div>'
            }, {
                iconLayout: 'default#imageWithContent',
                iconImageHref: '/assets/mobile/img/routes/marker-transparent.svg',
                iconImageSize: [50, 75],
                iconImageOffset: [-25, -75],
            });

            myMap.geoObjects.add(marker);
        });

    }
}
