import { IAddressItemFlat, IFlatWithDiscount } from '../../../../serv-files/serv-modules/addresses-api/addresses.interfaces';
import { FlatsDiscountService } from '../../commons/flats-discount.service';
import { WindowScrollLocker } from '../../commons/window-scroll-block';
import { FloorCount } from '../floor/floor-count';
import { IFlatBubbleCoordinates } from './flat-bubble/flat-bubble.component';
import { HouseService } from './house.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ViewEncapsulation, OnDestroy, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
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

    public houseNumber: any;
    public defaultParams: any;
    public sectionNumber: number;
    public sectionNumbers: any[] = [];
    public sectionsData: IFLatDisabled[][][] = [];
    public bubbleData: IFlatWithDiscount;
    public showBubble = false;
    public routerEvent;
    public showApartmentWindow = false;
    public selectedFlatIndex: number;
    public floorFlats: IFlatWithDiscount[];
    public floorCount = FloorCount;
    public searchFlats: IFlatWithDiscount[];
    public flatOnFloorCounter;
    // переменные для реализации скролла секций
    public scroll = 0;
    public chessMaxScroll: number;
    public scrollStep = 340;
    public lastScrollStep: number;

    public preloader = false;

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
        public ref: ChangeDetectorRef
    ) {
    }

    public ngOnInit() {
        this.routerEvent = this.routerChange();
    }

    public routerChange() {
        return this.activatedRoute.queryParams.subscribe((params) => {
            // Если номера домов не менялись отменяем формирование схемы
            if (this.defaultParams && this.defaultParams === params.houses) { return; }

            const houses = (params.houses).split(',');
            this.defaultParams = params.houses;
            this.preloader = true;
            if (houses.every( house => this.floorCount[house] )) {

                this.houseNumber = houses;
                this.sectionsData = [];
                this.sectionNumbers = [];
                this.houseNumber.forEach( house => {
                    this.sectionNumbers = [
                        ...this.sectionNumbers,
                        {
                            house,
                            sections: [ ...Object.keys(this.floorCount[Number(house)]) ] // создаём массив из номеров секций по выбранному дому.
                        }
                    ];
                });
                if (this.platform.isBrowser) {
                    this.sectionNumbers.forEach( obj => {
                        // получение квартир для нужных секций
                        obj.sections.forEach( section => {
                            this.getFlats(section, obj.house).subscribe(
                                (flats) => {
                                    this.buildSectionData(flats, section, obj.house);
                                    this.preloader = false;
                                },
                                (err) => {
                                    console.log(err);
                                    this.preloader = false;
                                }
                            );
                            if (this.searchFlats) {
                                setTimeout(() => {
                                    this.searchFlatsSelection();
                                }, 100);
                            }
                            setTimeout(() => this.scrollCalculate(), 1000);
                        });
                    });
                }
            } else {
                this.router.navigate(['/error-404'], {
                    skipLocationChange: true
                });
            }
        });
    }

    private buildSectionData(flats, sectionNumber, house) {
        const sectionData = flats.reduce((section: IFLatDisabled[][], flat: IAddressItemFlat) => {
            if (!section[flat.floor]) {
                section[flat.floor] = [];
            }
            section[flat.floor].push({...flat, discount: this.flatsDiscountService.getDiscount(flat), disabled: true});
            return section;
        }, []);

        sectionData.reverse();

        sectionData.map((floor: IFLatDisabled[]) => {
            floor.sort();
        });

        this.buildFakeFlats(sectionData, sectionNumber, house);

        // Удаляем дубликаты, если есть
        if (this.sectionsData.findIndex( item => item[0][0]._id === sectionData[0][0]._id) > -1) { return; }

        this.sectionsData.push(sectionData);
    }

    public searchFlatsSelection() {
        this.sectionsData.forEach((section: IFLatDisabled[][]) => {
            section.forEach((floor: IFLatDisabled[]) => {
                floor.forEach((flat: IFLatDisabled) => {
                    flat.disabled = true;
                    this.searchFlats.forEach((searchFlat: IFlatWithDiscount) => {
                        if (searchFlat.flat === flat.flat && searchFlat.house === flat.house ) {
                            flat.disabled = false;
                        }
                    });
                });
            });
        });
    }

    public buildFakeFlats(sectionData, sectionNumber, house) {
        /* Формируем новый объект для подсчета максимального кол-ва квартир на этаже
            это нужно для заполнения пустых мест в шахматке фейк-квартирами */
        sectionData.forEach((floor) => {
            if (!this.flatOnFloorCounter) {
                this.flatOnFloorCounter = {
                    [house]: {
                        [sectionNumber]: [...floor]
                    }
                };
            } else if (!this.flatOnFloorCounter[house]) {

                this.flatOnFloorCounter[house] = {
                    [sectionNumber]: [...floor]
                };
            } else if (!this.flatOnFloorCounter[house][sectionNumber]) {
                this.flatOnFloorCounter[house][sectionNumber] = [...floor];
            } else if (floor.length > this.flatOnFloorCounter[house][sectionNumber].length) {
                this.flatOnFloorCounter[house][sectionNumber] = floor;
            }
        });
    }

    public getFlats(sections, houses) {
        return this.service.getObjects({
            houses,
            sections
        });
    }

    public openApartmentModal(index, floorFlats) {
        this.selectedFlatIndex = index;
        this.floorFlats = floorFlats;
        this.windowScrollLocker.block();
        this.showApartmentWindow = true;
    }

    public showFlatBubble(event, flat, sectionContainer) {
        const bubbleHeight = flat.discount ? 312 : 288;
        const offsetTop = event.target.getBoundingClientRect().top - sectionContainer.getBoundingClientRect().top;
        this.bubbleCoords.top = (bubbleHeight > (offsetTop + 100)) || (bubbleHeight > event.target.getBoundingClientRect().top) ? event.target.getBoundingClientRect().top : event.target.getBoundingClientRect().top - bubbleHeight + 30;
        this.bubbleCoords.left = event.target.getBoundingClientRect().left + 40;
        this.bubbleData = flat;
        this.showBubble = true;
    }

    public ngAfterViewInit() {
        this.scrollCalculate();
        this.ref.detectChanges();
    }

    public scrollCalculate() {
        setTimeout(() => {
            this.scroll = 0;
            this.chessMaxScroll = this.chess.nativeElement.clientWidth - this.chessContainer.nativeElement.clientWidth;
            if (this.chessMaxScroll > 0 ) {
                this.lastScrollStep = this.chessMaxScroll % this.scrollStep;
            } else {
                this.chessMaxScroll = 0;
            }
        }, 1000); // даём время отрендериться шаблону чтобы оценить ширину блока с секциями
    }

    public scrollPrev() {
        this.scroll -= this.scrollStep;
        if (this.scroll < 0) {
            this.scroll = 0;
        }
    }

    public scrollNext() {
        if (this.chessMaxScroll - this.scroll === this.lastScrollStep) {
            this.scroll += this.lastScrollStep;
        } else {
            this.scroll += this.scrollStep;
        }
    }

    public ngOnDestroy() {
        // отписка от событий роута
        this.routerEvent.unsubscribe();
    }

    callConsoleLog(object) {
        console.log('callConsoleLog: ->', object);
        return object;
    }
}
