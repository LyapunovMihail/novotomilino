import { IAddressItemFlat, IFlatWithDiscount } from '../../../../serv-files/serv-modules/addresses-api/addresses.interfaces';
import { FlatsDiscountService } from '../../commons/flats-discount.service';
import { WindowScrollLocker } from '../../commons/window-scroll-block';
import { FloorCount } from '../floor/floor-count';
import { IFlatBubbleCoordinates } from './flat-bubble/flat-bubble.component';
import { HouseService } from './house.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ViewEncapsulation, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { PlatformDetectService } from './../../platform-detect.service';

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

export class HouseComponent implements OnInit, OnDestroy, AfterViewInit {

    public houseNumber: number;
    public sectionNumber: number;
    public sectionNumbers: string[] = [];
    public sectionData: IFLatDisabled[][] = null;
    public sectionsData: IFLatDisabled[][][] = [];
    public bubbleData: IFlatWithDiscount;
    public showBubble = false;
    public routerEvent;
    public showApartmentWindow = false;
    public selectedFlatIndex: number;
    public floorFlats: IFlatWithDiscount[];
    public floorCount = FloorCount;
    public searchFlats: IFlatWithDiscount[];
    // переменные для реализации скролла секций
    public scrollCount = 0;
    public maxScrollCount: number;
    public scrollStep = 340;
    public lastScrollStep: number;

    public bubbleCoords: IFlatBubbleCoordinates = {
        left: 100,
        top: 100
    };

    @ViewChild('chess')
    public chess: ElementRef;
    @ViewChild('chessContainer')
    public chessContainer: ElementRef;

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

    public ngAfterViewInit() {
        setTimeout(() => {
            console.log('this.chess.nativeElement.width: ', this.chess.nativeElement.clientWidth);
            const pageWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            const doubleContainerMargin = (pageWidth - this.chessContainer.nativeElement.clientWidth);
            const chessVisibleWidth = pageWidth - doubleContainerMargin;
            const chessInvisibleWidth = this.chess.nativeElement.clientWidth - chessVisibleWidth;

            if (chessInvisibleWidth > 0 ) {
                this.maxScrollCount = Math.ceil((chessInvisibleWidth) / this.scrollStep);
                this.lastScrollStep = (chessInvisibleWidth) % this.scrollStep;
                console.log('this.maxScrollCount: ', this.maxScrollCount);
                console.log('this.lastScrollStep: ', this.lastScrollStep);
            } else {
                this.maxScrollCount = 0;
            }
            console.log('this.maxScrollCount: ', this.maxScrollCount);
        }, 800); // даём время отрендериться шаблону чтобы оценить ширину блока с секциями
    }

    public scrollPrev() {
        this.scrollCount = this.scrollCount > 0 ? this.scrollCount - 1 : this.scrollCount;
    }

    public scrollNext() {
        if (this.scrollCount === this.maxScrollCount - 1) {
            this.scrollStep = this.lastScrollStep;
        }
        this.scrollCount = this.scrollCount < this.maxScrollCount ? this.scrollCount + 1 : this.scrollCount;
    }

    public routerChange() {
        return this.activatedRoute.params.subscribe((params) => {
            if (this.floorCount[params.house] && this.floorCount[params.house][params.section]) {
                this.houseNumber = params.house;
                this.sectionNumbers = Object.keys(this.floorCount[this.houseNumber]); // создаём массив из номеров секций по выбранному дому.
                if (this.platform.isBrowser) {
                    // получение квартир для нужных секций
                    this.sectionNumbers.forEach((sectionNumber) => {
                        this.getFlats(sectionNumber).subscribe(
                            (flats) => {
                                console.log('flats: ', flats);
                                this.buildSectionData(flats, sectionNumber);
                            },
                            (err) => console.log(err)
                        );
                        if (this.searchFlats) {
                            this.searchFlatsSelection();
                        }
                    });
                }
            } else {
                this.router.navigate(['/error-404'], {
                    skipLocationChange: true
                });
            }
        });
    }

    private buildSectionData(flats, sectionNumber) {
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

        this.sectionsData[sectionNumber - 1] = this.sectionData;
    }

    public searchFlatsSelection() {
        this.sectionsData.forEach((section: IFLatDisabled[][]) => {
            section.forEach((floor: IFLatDisabled[]) => {
                floor.forEach((flat: IFLatDisabled) => {
                    flat.disabled = true;
                    this.searchFlats.forEach((searchFlat: IFlatWithDiscount) => {
                        if (searchFlat.house === Number(this.houseNumber)
                            && searchFlat.flat === flat.flat ) {
                            flat.disabled = false;
                        }
                    });
                });
            });
        });
    }

    public getFlats(section) {
        return this.service.getObjects({
            houses: this.houseNumber,
            sections: section
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
