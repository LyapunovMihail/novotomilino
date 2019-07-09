import { Component, OnInit } from '@angular/core';
declare let ymaps: any;

@Component({
    selector: 'app-location-routes',
    template: `<div class="location_map" id="way-map"></div>`,
    styleUrls: ['../location.component.scss'],
    providers: []
})

export class LocationRoutesComponent implements OnInit {

    constructor() { }

    ngOnInit( ) {
        this.initMap();
    }

    public initMap( ) {
        ymaps.ready(function () {
            let myMap = new ymaps.Map('way-map', {
                center: [55.753994, 37.622093],
                zoom: 9,
                // Добавим панель маршрутизации.
                controls: ['routePanelControl']
            });

            let control = myMap.controls.get('routePanelControl');

            // Зададим состояние панели для построения машрутов.
            control.routePanel.state.set({
                // Тип маршрутизации.
                type: 'masstransit',
                // Выключим возможность задавать пункт отправления в поле ввода.
                fromEnabled: true,
                // Включим возможность задавать пункт назначения в поле ввода.
                toEnabled: false,
                to: 'ул. Барвихинская, 6'
            });

            // Зададим опции панели для построения машрутов.
            control.options.set({
                // Запрещаем показ кнопки, позволяющей менять местами начальную и конечную точки маршрута.
                allowSwitch: false,
                // Включим определение адреса по координатам клика.
                // Адрес будет автоматически подставляться в поле ввода на панели, а также в подпись метки маршрута.
                reverseGeocoding: true,
                // Зададим виды маршрутизации, которые будут доступны пользователям для выбора.
                types: { masstransit: true, pedestrian: true, taxi: true },

                position: {
                    top: '83px',
                    left: '10px'
                }
            });


            // Создаем кнопку, с помощью которой пользователи смогут менять местами начальную и конечную точки маршрута.
            // var switchPointsButton = new ymaps.control.Button({
            //     data: {content: "Поменять местами", title: "Поменять точки местами"},
            //     options: {selectOnClick: false, maxWidth: 160}
            // });
            // // Объявляем обработчик для кнопки.
            // switchPointsButton.events.add('click', function () {
            //     // Меняет местами начальную и конечную точки маршрута.
            //     control.routePanel.switchPoints();
            // });
            // myMap.controls.add(switchPointsButton);
        });
    }
}
