import { DOCUMENT } from '@angular/platform-browser';
import { markersConfig, navList } from './config';
import { PlatformDetectService } from './../../platform-detect.service';
import { Component, Inject, OnInit } from '@angular/core';
declare let ymaps: any;
declare let $: any;

@Component({
    selector: 'app-location-infrastructure',
    templateUrl: './location-infrastructire.component.html',
     // стили для маркеров лежат отдельно /app/styles/ui-kit/_markers
    styleUrls: ['./../location.component.scss']
})

export class LocationInfrastructureComponent implements OnInit {

    // кнопки боковой навигации
    navList = navList;

    // определяет первое нажатие в боковом меню при заходе на страницу
    isFirstClick = true;

    // массив для временного хранения маркеров
    // чтобы можно было их находить при необходимости давать z-index
    // при выборе определенного типа
    markers = [];

    constructor (
        private platform: PlatformDetectService,
        @Inject(DOCUMENT) private document: any
    ) { }

    ngOnInit () {
        this.initMap();
    }

    openToolTip (type) {
        if ( !this.platform.isBrowser ) { return false; }

        // элементы маркеров
        let tooltipType = $(`.marker-content--${type}`);
        // кнопки бокового меню
        let item = $(`.location_aside_list_item--${type}`);

        if (this.isFirstClick) {
            // при первом клике у всех маркеров и кнопок боковой навигации
            // удаляются активные классы
            this.isFirstClick = false;
            $('.marker-content').removeClass('marker-content_tooltip--active');
            $('.location_aside_list_item').removeClass('location_aside_list_item--active');
            // а кнопкам выбранного типа добавляются
            item.addClass('location_aside_list_item--active');
            tooltipType.addClass('marker-content_tooltip--active');
        } else {
            // при последующих выборах просто toggle
            item.toggleClass('location_aside_list_item--active');
            tooltipType.toggleClass('marker-content_tooltip--active');
        }

        // для всех маркеров
        $('.marker-content').each(function (i) {
            // если в результате выполнения условия выше у маркера активный класс
            if ( $(this).hasClass('marker-content_tooltip--active') ) {
                // то удаляем у него не активный
                $(this).removeClass('marker-content_tooltip-not-active');
            }
        });

        // добавляется задержка в исполнении анимации
        // ждет пока тултипы свернутся
        setTimeout (() => {
            $('.marker-content').each(function (i) {
                // затем элементам без активного класса вешается не активный класс
                if ( !$(this).hasClass('marker-content_tooltip--active') && !$(this).hasClass('marker-content--main-marker') ) {
                    $(this).addClass('marker-content_tooltip-not-active');
                }
            });
            // время за которое тултипы свернутся
            // должно быть не менее 200
        }, 300);

        // всем выбранным маркерам через yamaps api добавляется z-index
        this.markers.forEach((marker) => {
            marker['marker'].options.set({
                zIndex: (marker.type === type) ? 100 : 10
            });
        });
    }

    // инициализация карты
    initMap () {
        if ( !this.platform.isBrowser ) { return false; }

        let that = this;
        ymaps.ready(() => {

            let myMap = new ymaps.Map('map', {
                center: [55.663139, 37.958373],
                zoom: 17,
                controls: []
            }, {
                minZoom: 11,
                maxZoom: 18
            });

            // создание наземное наложение плана
            let polygon = new ymaps.Polygon([
                    [ [55.683600, 37.895600], [55.685350, 37.895600], [55.685350, 37.898540], [55.683600, 37.898540] ]
                ], {}, {
                    fillImageHref: '/assets/img/office/plan.png',
                    fillMethod: 'stretch',
                    stroke: false
                }
            );
            // добавление плана на карту
            myMap.geoObjects.add(polygon);

            // из маркер-конфига собираем массив маркеров
            markersConfig.forEach( ( item, index ) => {
                that.markers[index] = {};
                that.markers[index]['active'] = true;
                that.markers[index]['type'] = item.type;
                that.markers[index]['marker'] = new ymaps.Placemark(item.coord, {
                    iconContent: `<div class="marker-content marker-content__tooltip_active marker-content__${item.type}">${item.content}</div>`
                }, {
                    iconLayout: 'default#imageWithContent',
                    iconImageHref: '/assets/img/location/marker-transparent.svg',
                    iconImageSize: (item['size']) ? item['size'] : [30, 46],
                    iconImageOffset: (item['offset']) ? item['offset'] : [-15, -46],
                    zIndex: 10
                });

                myMap.geoObjects.add(that.markers[index]['marker']);

            });
        });

    }
}
