import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
declare let ymaps: any;

@Component({
    selector: 'app-builder-map',
    templateUrl: 'builder-map.component.html',
    styleUrls: ['./builder-map.component.scss']
})

export class BuilderMapComponent implements OnInit, OnChanges {

    @Input() public projects;
    @Input() public filter;
    public uploadPath = `//3-red.com/uploads/object/`;

    public markers = [];
    public map;

    constructor(
        private router: Router,
        public ref: ChangeDetectorRef,
    ) { }

    public get filteredProject() {
        if (!this.projects || !this.projects.length) { return []; }
        return this.filter === 'ilike'
            ? this.projects.filter(el => el.ilike && el.name !== 'Новотомилино')
            : this.projects.filter(el => el.name !== 'Новотомилино');
    }

    ngOnInit() {
        this.initMap();
    }
    ngOnChanges(change: SimpleChanges) {
        if ('filter' in change && this.map) {
            this.addMarker(this.filter === 'ilike');
        }
    }

    private initMap() {
        this.markers = [];
        ymaps.ready(() => {

            if (this.map) { this.map.destroy(); }
            this.map = new ymaps.Map('map', {
                center: [55.751574, 37.573856],
                zoom: 9,
                controls: ['zoomControl']
            });
            this.map.behaviors.disable(['scrollZoom']);

            this.addMarker(this.filter === 'ilike');

            this.ref.detectChanges();
        });
    }
    private addMarker(refresh?) {
        if (refresh) {
            this.markers = [];
            this.map.geoObjects.removeAll();
        }

        this.filteredProject.forEach((item, index) => {

            this.markers[index] = {};
            this.markers[index].click = false;
            this.markers[index].url = `http://95.142.35.16:8010/objects/list/${item._id}`;
            this.markers[index].thumbnail = item.image;
            this.markers[index].name = item.title;
            this.markers[index].status = item.status;

            const iconLayout = `
                <div class="img-map" id="img-map-${index}">
                    <img src="${this.uploadPath}${item.image}" alt="image">
                </div>
            `;
            this.markers[index].marker = new ymaps.Placemark(item.coords.split(','), {
                    iconContent: iconLayout
                }, {
                    iconLayout: 'default#imageWithContent',
                    iconImageHref: '',
                    iconImageSize: [64, 64],
                    iconImageOffset: [-24, -24],
                    iconContentOffset: [15, 15],
                    zIndex: 1
            });
            this.map.geoObjects.add(this.markers[index].marker);
            this.markers[index].marker.events
                .add('mouseenter', (e) => {
                    // Ссылку на объект, вызвавший событие,
                    // можно получить из поля 'target'.
                    // e.get('target').options.set('preset', 'islands#greenIcon');
                    document.querySelector(`#img-map-${index}`).classList.add('img-map--hover');
                    this.markers[index].marker.options.set({ zIndex: 10 });
                })
                .add('mouseleave', (e) => {
                    document.querySelector(`#img-map-${index}`).classList.remove('img-map--hover');
                    this.markers[index].marker.options.set({ zIndex: 1 });
                })
                .add('click', (e) => {
                    window.open(this.markers[index].url, '_blank');
                });
        });
    }

    public sideMarkerHover(i) {
        document.querySelector(`#img-map-${i}`).classList.add('img-map--hover');
        this.markers[i].marker.options.set({
            zIndex: 10
        });
    }

    public sideMarkerDishover(i) {
        document.querySelector(`#img-map-${i}`).classList.remove('img-map--hover');
        this.markers[i].marker.options.set({
            zIndex: 1
        });
    }
}
