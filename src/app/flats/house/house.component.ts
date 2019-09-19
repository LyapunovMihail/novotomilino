import { IAddressItemFlat, IFlatWithDiscount } from '../../../../serv-files/serv-modules/addresses-api/addresses.interfaces';
import { FlatsDiscountService } from '../../commons/flats-discount.service';
import { WindowScrollLocker } from '../../commons/window-scroll-block';
import { FloorCount } from '../floor/floor-count';
import {
    IFlatBubbleCoordinates
} from './flat-bubble/flat-bubble.component';
import {
    HouseService
} from './house.service';
import {
    ActivatedRoute,
    Router
} from '@angular/router';
import {
    Component,
    OnInit,
    ViewEncapsulation,
    OnDestroy
} from '@angular/core';
import {
    PlatformDetectService
} from './../../platform-detect.service';
import set = Reflect.set;

interface IFLatDisabled extends IFlatWithDiscount {
    disabled: boolean;
}

@Component({
    selector: 'app-flats-house-page',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./house.component.scss', '../flats.component.scss'],
    templateUrl: './house.component.html',
    providers: [
        WindowScrollLocker,
        HouseService
    ]
})

export class HouseComponent implements OnInit, OnDestroy {

    public houseNumber: number;
    public sectionNumber: number;
    public sectionData: IFLatDisabled[][] = null;
    public bubbleData: IFlatWithDiscount;
    public showBubble = false;
    public routerEvent;
    public showApartmentWindow = false;
    public selectedFlatIndex: number;
    public floorFlats: IFlatWithDiscount[];
    public floorCount = FloorCount;
    public sectionSelector: string[] = [];
    public searchFlats: IFlatWithDiscount[];

    public bubbleCoords: IFlatBubbleCoordinates = {
        left: 100,
        top: 100
    };

    constructor(
        private router: Router,
        public activatedRoute: ActivatedRoute,
        public service: HouseService,
        private flatsDiscountService: FlatsDiscountService,
        public windowScrollLocker: WindowScrollLocker,
        private platform: PlatformDetectService,
    ) {
    }

    public ngOnInit() {
        this.routerEvent = this.routerChange();
    }

    public routerChange() {
        return this.activatedRoute.params.subscribe((params) => {
            if (this.floorCount[params.house] && this.floorCount[params.house][params.section]) {
                this.houseNumber = params.house;
                this.sectionNumber = params.section;
                this.sectionSelector = Object.keys(this.floorCount[this.houseNumber]); // создаём массив из секций по выбранному дому для переключалки.
                if (this.platform.isBrowser) {
                    // получение квартир для нужных секций
                    this.getFlats().subscribe(
                        (flats) => {
                            this.buildSectionData(flats);
                        },
                        (err) => console.log(err)
                    );
                }
            } else {
                this.router.navigate(['/error-404'], {
                    skipLocationChange: true
                });
            }
        });
    }

    private buildSectionData(flats) {
        this.sectionData = flats.reduce((section: IFLatDisabled[][], flat: IAddressItemFlat) => {
            if (!section[flat.floor]) {
                section[flat.floor] = [];
            }
            section[flat.floor].push({...flat, discount: this.flatsDiscountService.getDiscount(flat), disabled: true});
            return section;
        }, []);

        this.sectionData.reverse();

        this.sectionData.map((floor: IFLatDisabled[]) => {
            floor.sort();
        });

        console.log('this.sectionData: ', this.sectionData);
        if (this.searchFlats) {
            this.searchFlatsSelection();
        }
    }

    public searchFlatsSelection() {
        this.sectionData.forEach((floor: IFLatDisabled[]) => {
            floor.forEach((flat: IFLatDisabled) => {
                flat.disabled = true;
                this.searchFlats.forEach((searchFlat: IFlatWithDiscount) => {
                    if (searchFlat.house === Number(this.houseNumber)
                        && searchFlat.section === Number(this.sectionNumber)
                        && searchFlat.flat === flat.flat ) {
                        flat.disabled = false;
                        if (flat.rooms !== searchFlat.rooms) {
                            console.log('houseFlat: ', flat);
                            console.log('searchFlat: ', searchFlat);
                        }
                    }
                });
            });
        });
    }

    public getFlats() {
        return this.service.getObjects({
            houses: this.houseNumber,
            sections: this.sectionNumber
        });
    }

    public ngOnDestroy() {
        // отписка от событий роута
        this.routerEvent.unsubscribe();
    }

    public openApartmentModal(index, floorFlats) {
        this.selectedFlatIndex = index;
        this.floorFlats = floorFlats;
        this.windowScrollLocker.block();
        this.showApartmentWindow = true;
    }

    public showFlatBubble(event, flat) {
        const houseElem = document.querySelector('.house');
        const distanceToBottom = houseElem.clientHeight + 30 - (event.target.offsetTop + 125);
        const bubbleHeight = flat.discount ? 312 : 288;
        this.bubbleCoords.top = (distanceToBottom > bubbleHeight) ? event.target.getBoundingClientRect().top : event.target.getBoundingClientRect().top - bubbleHeight + 30;
        this.bubbleCoords.left = event.target.getBoundingClientRect().left + 40;
        this.bubbleData = flat;
        this.showBubble = true;
    }
}
