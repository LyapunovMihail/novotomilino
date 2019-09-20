import { Injectable } from '@angular/core';
import { markerConfig } from './config';
declare const ymaps: any;

@Injectable()
export class MapService {

    public initMap() {
        const markers = [];

        ymaps.ready(function () {

            let myMap = new ymaps.Map('map', {

                center: [55.716239, 37.389512],
                zoom: 16,
                controls: [],
                behaviors: ['multiTouch']
            });

            if ((window.innerWidth
                || document.documentElement.clientWidth
                || document.body.clientWidth) >= 1280) {

                myMap.controls.add('zoomControl', {

                    size: "large"
                });
            }

            myMap.behaviors.disable('scrollZoom');

            let HintLayout = ymaps.templateLayoutFactory.createClass("<div class='my-hint'>$[properties.balloonContentBody]</div>");

            function getPointData(index) {

                return {

                    balloonContentBody: '<p class="hint-title">' + markerConfig[index].title + '</p>'
                };
            }

            markerConfig.forEach(function (marker, i) {

                markers[i] = new ymaps.Placemark(marker.coords, getPointData(i), {

                    iconLayout: 'default#imageWithContent',
                    iconImageSize: [86, 72],
                    iconImageHref: marker.icon_marker,
                    iconImageOffset: [-20, -33],
                    hideIconOnBalloonOpen: false,
                    balloonLayout: HintLayout,
                    balloonOffset: [27, -34]
                });

                markers[i].events.add('mouseenter', function(e) {

                    let position = e.get('target').geometry.getCoordinates();
                    let balloon = e.get('target').balloon;

                    balloon.open(position);
                });

                markers[i].events.add('mouseleave', function(e) {

                    let position = e.get('target').geometry.getCoordinates();
                    let balloon = e.get('target').balloon;

                    setTimeout(function() {

                        balloon.close(position);
                    }, 100);
                });

                myMap.geoObjects.add(markers[i]);
            });

            let skolkovo = new ymaps.Placemark([55.714951, 37.388411], null, {

                iconLayout: 'default#imageWithContent',
                iconImageSize: [116, 56],
                iconImageHref: '/assets/img/skolkovo.svg',
            });

            let kutuzovski = new ymaps.Placemark([55.714951, 37.390014], null, {

                iconLayout: 'default#imageWithContent',
                iconImageSize: [172, 56],
                iconImageHref: '/assets/img/kutuzovskij.svg',
                iconImageOffset: [50, 0]
            });

            let beginKutuz = new ymaps.Placemark([55.725649, 37.458269], null, {

                iconLayout: 'default#imageWithContent',
                iconImageSize: [86, 72],
                iconImageHref: '/assets/img/begin.svg',
                iconImageOffset: [-170, 0]
            });

            let beginSkolkovo = new ymaps.Placemark([55.688050, 37.365963], null, {

                iconLayout: 'default#imageWithContent',
                iconImageSize: [86, 72],
                iconImageHref: '/assets/img/school-ic.svg'
            });

            myMap.geoObjects.add(skolkovo);
            myMap.geoObjects.add(kutuzovski);
            myMap.geoObjects.add(beginKutuz);
            myMap.geoObjects.add(beginSkolkovo);
        });
    }
}
