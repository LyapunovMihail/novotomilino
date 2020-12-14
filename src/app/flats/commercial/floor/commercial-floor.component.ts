import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { IFlatWithDiscount } from '../../../../../serv-files/serv-modules/addresses-api/addresses.interfaces';
import { WindowScrollLocker } from '../../../commons/window-scroll-block';
import { FloorService } from '../../floor/floor.service';
import { CommercialService } from '../commercial.service';

@Component({
    selector: 'app-commercial-floor',
    templateUrl: 'commercial-floor.component.html',
    styleUrls: ['./commercial-floor.component.scss'],
    providers: [
        WindowScrollLocker,
        CommercialService,
        FloorService
    ],
    encapsulation: ViewEncapsulation.None,
})

export class CommercialFloorComponent implements OnInit, OnDestroy {

    public params;
    public apartaments;
    public paramsSubcribe;
    public config;

    public floorSvg;
    public loadFloorSvg = false;
    public infoWindow: IFlatWithDiscount;
    public showApartmentWindow = false;
    public selectedFlatIndex: number;
    public floorFlats: IFlatWithDiscount[];


    public sections = [];
    public floor = [];

    constructor(
        private http: HttpClient,
        private activateRouter: ActivatedRoute,
        private commercialService: CommercialService,
        public windowScrollLocker: WindowScrollLocker,
        public floorService: FloorService,
        private router: Router
    ) { }

    public getSVGpath(house,section,floor) { return `/assets/floor-plans/house_${house}/section_${section}/floor_${floor}/sect_${section}_fl_${floor}.svg`; }

    ngOnInit() {
        this.subscribeParams();
        this.loadFloorSvg = true;
    }
    ngOnDestroy() {
        if (this.paramsSubcribe) {
            this.paramsSubcribe.unsubscribe();
        }
    }

    private subscribeParams() {
        this.paramsSubcribe = this.activateRouter.params.subscribe(params => {
            this.params = params;

            this.getFloorSvg(this.getSVGpath(this.params.houses, this.params.sections, this.params.floor))
                .subscribe((data: string) => {
                    this.floorSvg = data;
                    this.floorSvg = this.floorSvg.slice(1, 4) !== 'svg' ? '' : this.floorSvg;

                    this.getFlats(this.params);
                },
                (err) => {
                    this.floorSvg = '';
                    this.getFlats(this.params);
                    console.log(err);
                }
            );
        });
    }
    private getFlats(value) {
        const params = {
            type: 'КН',
            houses: value.houses,
        };
        this.commercialService.getObjects(params).subscribe(
            data => {
                this.apartaments = data;
                this.parseError(data, params);
                this.buildSections(data);
                this.buildFloor(data);
                console.log(data);
                this.floorService.flatsHover(this.apartaments, {
                    click: (i) => this.openApartmentModal(i, this.apartaments),
                    hover: (flat) => this.infoWindow = flat
                });
                setTimeout(() => this.loadFloorSvg = false);
            },
            error => {
                console.error(error);
                this.router.navigate(['/error-404'], {
                    skipLocationChange: true
                });
            });
    }
    private buildSections(flats) {
        this.sections = flats.map(el => el.section).filter((el,i,arr) => arr.indexOf(el) === i).sort();
    }
    private buildFloor(flats) {
        this.floor = flats.map(el => el.floor).filter((el,i,arr) => arr.indexOf(el) === i).sort();
    }
    private parseError(flats, params) {
        if (flats.some(el => el.house !== +params.houses)) { this.router.navigate(['/error-404'], { skipLocationChange: true }); }
    }
    private getFloorSvg(url): Observable<string> {
        return this.http.get<string>(url, { responseType: 'text' as 'json' });
    }

    public navigate(section) {
        this.router.navigate([`/flats/commercial/house/${this.params['houses']}/section/${section}/floor/1`]);
    }
    public openApartmentModal(index, floorFlats) {
        // const filteredFlats = floorFlats.filter(el => el.floor === +this.params.floor && el.section === +this.params.sections);
        // this.selectedFlatIndex = filteredFlats.findIndex(el => el._id === floorFlats[index]._id);
        // this.floorFlats = filteredFlats;
        // this.windowScrollLocker.block();
        // this.showApartmentWindow = true;
        const flatData = floorFlats.find((el,j) => j === index);
        sessionStorage.setItem('ntm-prev-route', JSON.stringify({ route: this.router.url.split('?')[0] }));
        this.router.navigate([`/flats/house/${flatData.house}/section/${flatData.section}/floor/${flatData.floor}/office/${flatData.flat}`]);
    }
}
