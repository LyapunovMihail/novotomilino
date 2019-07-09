import { IAddressItemFlat } from '../../../../serv-files/serv-modules/addresses-api/addresses.interfaces';
import { animate } from '@angular/animations';
import { FloorCount } from './floor-count';
import { HttpClient } from '@angular/common/http';
import { PlatformDetectService } from './../../platform-detect.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Component, ViewEncapsulation, OnInit, OnDestroy, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { FloorService } from './floor.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-flats-floor-page',
    templateUrl: './floor.component.html',
    styleUrls: ['./floor.component.scss', '../flats.component.scss'],
    providers: [
        FloorService
    ],
    encapsulation: ViewEncapsulation.None,
    // changeDetection: ChangeDetectionStrategy.OnPush,
})

export class FloorComponent implements OnInit, OnDestroy {

    public floorSelector: number[] = [];
    public floorCount = FloorCount;
    public floorSvg: string = '';
    public routerEvents: any;
    public sectionNumber: number;
    public floorNumber: number;
    public dottedListMenu: any[] = [];
    public infoWindow: IAddressItemFlat;

    constructor(
        public router: Router,
        public activatedRoute: ActivatedRoute,
        public elRef: ElementRef,
        public platform: PlatformDetectService,
        public http: HttpClient,
        public floorService: FloorService
    ) {}

    public ngOnInit() {
        this.routerEvents = this.routerChange();
    }

    public routerChange() {
        return this.activatedRoute.params
        .subscribe((params: any) => {
            // проверка на соответствие секции и этажа из конфига ./floor-count.ts
            if ( Object.keys(this.floorCount).some((i) => params['section'] === i)
                && this.floorCount[params['section']].some((i) => Number(params['floor']) === i) ) {
                this.sectionNumber = Number(params['section']);
                this.floorNumber = Number(params['floor']);
                this.floorSelector = this.floorCount[this.sectionNumber];
                this.getFloorSvg(`/assets/floor-plans/section_${this.sectionNumber}/floor_${this.floorNumber}/sect_${this.sectionNumber}_fl_${this.floorNumber}.svg`)
                .subscribe(
                    (data: string) => {
                        this.floorSvg = data;
                        this.floorService.getObjects({
                            sections: this.sectionNumber + '',
                            floor: this.floorNumber + ''
                        }).subscribe(
                            (flats: IAddressItemFlat[]) => {
                                if ( this.platform.isBrowser ) {
                                    const modList = [{
                                        name: 'Студии',
                                        mod: 'studio',
                                        count: 0
                                    }, {
                                        name: 'Однокомнатные',
                                        mod: 'one-room',
                                        count: 0
                                    }, {
                                        name: 'Двухкомнатные',
                                        mod: 'two-room',
                                        count: 0
                                    }, {
                                        name: 'Трехкомнатные',
                                        mod: 'three-room',
                                        count: 0
                                    }];
                                    flats.forEach((item) => {
                                        modList[Number(item.rooms)].count += 1;
                                    });
                                    this.dottedListMenu = modList.filter((item) => item.count > 0);
                                    this.floorService.flatsHover(flats, {
                                        click: (flat) => this.router.navigate([`/flats/section/${flat.section}/floor/${flat.floor}/apartment/${flat.flat}`]),
                                        hover: (flat) => this.infoWindow = flat
                                    });
                                }
                            },
                            (err) => {
                                console.log(err);
                            }
                        );
                    },
                    (err) => {
                        this.floorSvg = `<div class="floor-plan-error-description">Для этого этажа изображение отсутствует</div>`;
                        console.log(err);
                    }
                );
            } else {
                this.router.navigate(['/error-404'], { skipLocationChange: true });
            }
        });
    }

    public ngOnDestroy() {
        this.routerEvents.unsubscribe();
    }

    public getFloorSvg(url): Observable<string> {
        return this.http.get<string>(url, { responseType: 'text' as 'json' });
    }

    public svgRouterLink(section) {
        const floor = (this.floorCount[section].some((i) => Number(this.floorNumber) === i))
            ? this.floorNumber
            : this.floorCount[section][this.floorCount[section].length - 1];
        this.router.navigate([`/flats/section/${section}/floor/${floor}`]);
    }
}
