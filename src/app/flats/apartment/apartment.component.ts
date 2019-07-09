import { FavoritesService } from './../../commons/favorites.service';
import { WindowScrollLocker } from './../../commons/window-scroll-block';
import { ApartmentService } from './apartment.service';
import { FloorCount } from './../floor/floor-count';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { IAddressItemFlat } from '../../../../serv-files/serv-modules/addresses-api/addresses.interfaces';

@Component({
    selector: 'app-flats-apartment-page',
    templateUrl: './apartment.component.html',
    styleUrls: ['./apartment.component.scss', '../flats.component.scss'],
    providers: [
        WindowScrollLocker,
        ApartmentService
    ]
})

export class ApartmentComponent implements OnInit, OnDestroy {

    public routerEvents: any;
    public floorCount = FloorCount;

    public isCallFormOpen: boolean = false;
    public isCreditFormOpen: boolean = false;
    public isReserveFormOpen: boolean = false;

    public flatData: IAddressItemFlat;

    public pdfLink: string;

    constructor(
        public windowScrollLocker: WindowScrollLocker,
        public router: Router,
        public activatedRoute: ActivatedRoute,
        public apartmentService: ApartmentService,
        private favoritesService: FavoritesService,
    ) {}

    public ngOnInit() {
        this.routerEvents = this.routerChange();
    }

    public ngOnDestroy() {
        this.routerEvents.unsubscribe();
    }

    public toFavorite(): void {
        this.favoritesService.toFavorite(this.flatData);
    }

    get inFavorite(): boolean {
        return this.favoritesService.inFavorite(this.flatData);
    }

    public routerChange() {
        return this.activatedRoute.params
        .subscribe((params: any) => {
            // проверка на соответствие секции и этажа из конфига ./floor-count.ts
            if ( Object.keys(this.floorCount).some((i) => params['section'] === i )
                && this.floorCount[params['section']].some((i) => Number(params['floor']) === i) ) {
                this.apartmentService.getObjects({
                    sections: params['section'],
                    floor: params['floor'],
                    number: params['apartment']
                }).subscribe(
                    (data: IAddressItemFlat[]) => {
                        if (data.length === 1) {
                            this.flatData = data[0];
                            this.pdfLink = `/api/pdf?id=${data[0]['_id']}`;
                        } else {
                            this.router.navigate(['/error-404'], { skipLocationChange: true });
                        }
                    },
                    (err) => {
                        console.log(err);
                    }
                );

            } else {
                this.router.navigate(['/error-404'], { skipLocationChange: true });
            }
        });
    }

    public svgRouterLink(section) {
        const floor = (this.floorCount[section].some((i) => Number(this.flatData.floor) === i))
            ? this.flatData.floor
            : this.floorCount[section][this.floorCount[section].length - 1];
        this.router.navigate([`/flats/section/${section}/floor/${floor}`]);
    }

}
