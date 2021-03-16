import { DOCUMENT } from '@angular/platform-browser';
import { markersConfig, navList } from './config';
import { PlatformDetectService } from '../../platform-detect.service';
import { Component, Inject, OnInit } from '@angular/core';
declare let ymaps: any;
declare let $: any;

@Component({
    selector: 'app-location-infrastructure',
    templateUrl: './location-infrastructure.component.html',
     // стили для маркеров лежат отдельно /app/styles/ui-kit/_markers
    styleUrls: ['./location-infrastructure.component.scss']
})

export class LocationInfrastructureComponent implements OnInit {

    // кнопки боковой навигации
    public navList = navList;
    public firstNavClick = true;
    // массив для временного хранения маркеров
    // чтобы можно было их находить при необходимости давать z-index
    // при выборе определенного типа
    public markers = [];

    constructor(
        private platform: PlatformDetectService
    ) { }

    ngOnInit() {
        this.initMap();
    }

    openToolTip(type) {
        if ( !this.platform.isBrowser ) { return false; }

        // кнопки бокового меню
        if (this.firstNavClick && type === 'all') {
            $('.infrastructure__list-item--all').removeClass('item-active');
            this.markers.forEach((marker) => {
                if (marker.type !== 'main-marker') {
                    $(`.infrastructure__list-item--${marker.type}`).removeClass('item-active');
                    marker.marker.options.set({
                        visible: false
                    });
                }
            });
            this.firstNavClick = false;
            return;
        }
        if (this.firstNavClick) {
            this.markers.forEach((marker) => {
                if (marker.type !== type && marker.type !== 'main-marker') {
                    $(`.infrastructure__list-item--${marker.type}`).removeClass('item-active');
                    $(`.infrastructure__list-item--all`).removeClass('item-active');
                    marker.marker.options.set({
                        visible: false
                    });
                }
            });
            this.firstNavClick = false;
            return;
        }

        const item = $(`.infrastructure__list-item--${type}`);

        item.toggleClass('item-active');

        if (type === 'all') {
            const checked = item.hasClass('item-active');
            this.markers.forEach((marker) => {
                const elem = $(`.infrastructure__list-item--${marker.type}`);
                if (checked) {
                    if (!elem.hasClass('item-active')) {
                        $(`.infrastructure__list-item--${marker.type}`).addClass('item-active');
                    }
                    marker.marker.options.set({ visible: true });
                } else {
                    if (marker.type !== 'main-marker') {
                        $(`.infrastructure__list-item--${marker.type}`).removeClass('item-active');
                        marker.marker.options.set({ visible: false });
                    }
                }
            });
            return;
        }

        // всем выбранным маркерам через yamaps api добавляется видимость visible
        this.markers.forEach((marker) => {
            if (marker.type === type) {
                marker.marker.options.set({
                    visible: item.hasClass('item-active')
                });
            }
        });
    }

    // инициализация карты
    initMap() {
        if ( !this.platform.isBrowser ) { return false; }

        const that = this;
        ymaps.ready(() => {
            const zoomControl = new ymaps.control.ZoomControl({
                options: {
                    // size: "small",
                    position: {
                        left: 'auto',
                        right: 10,
                        top: 120,
                    }
                }
            });

            const myMap = new ymaps.Map('map', {
                center: [55.656725165497704, 37.92175475135617],
                zoom: 14,
                controls: [zoomControl]
            }, {
                minZoom: 11,
                maxZoom: 18
            });
            // myMap.behaviors.disable(['scrollZoom']);

            // из маркер-конфига собираем массив маркеров
            markersConfig.forEach( ( item, index ) => {
                that.markers[index] = {};
                that.markers[index].click = false;
                that.markers[index].type = item.type;
                that.markers[index].marker = new ymaps.Placemark(item.coord, {
                    iconContent: `<div id="marker-${index}" class="marker-content marker-content__${item.type}">${item.content}</div>`
                }, {
                    iconLayout: 'default#imageWithContent',
                    iconImageHref: '/assets/img/location/marker-transparent.svg',
                    iconImageSize: (item.size) ? item.size : [30, 46],
                    iconImageOffset: (item.offset) ? item.offset : [-5, -15],
                    zIndex: 10
                });

                myMap.geoObjects.add(that.markers[index].marker);

                // Навешиваем события на маркеры. Если мышь над маркером - показываем маркер, если нет - убираем (если не было клика, если был - ховер не срабатывает).
                // Если клик по маркеру - показываем. Если повторный клик по маркеру - убираем.
                that.markers[index].marker.events.add('mouseenter', () => {
                    if (!that.markers[index].click) {
                        $(`#marker-${index}`).addClass('marker-content_active');
                    }
                });
                that.markers[index].marker.events.add('mouseleave', () => {
                    if (!that.markers[index].click) {
                        $(`#marker-${index}`).removeClass('marker-content_active');
                    }
                });
                that.markers[index].marker.events.add('click', () => {
                    that.markers[index].click = !that.markers[index].click;
                    $('.marker-content').removeClass('marker-content_active');
                    if (that.markers[index].click) {
                        $(`#marker-${index}`).addClass('marker-content_active');
                    } else {
                        $(`#marker-${index}`).removeClass('marker-content_active');
                    }
                });
            });
        });

    }
}
