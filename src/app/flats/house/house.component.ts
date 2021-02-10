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

    public defaultParams: any;
    public houseNumbers: string[];
    public chess: IFLatDisabled[][][][];
    public bubbleData: IFlatWithDiscount;
    public floorBubble; // Модальное окно при наведении на этаж в схеме
    public showBubble = false;
    public floorShowBubble = false;
    public routerEvent;
    public showApartmentWindow = false;
    public selectedFlatIndex: number;
    public floorFlats: IFlatWithDiscount[];
    public searchFlats: IFlatWithDiscount[];
    // переменные для реализации скролла секций
    public scroll = 0;
    public chessMaxScroll: number;
    public scrollStep = 340;
    public lastScrollStep: number;

    public preloader = false;
    public showPopular = false;

    public floorClicked: boolean;
    public bubbleCoords: IFlatBubbleCoordinates = {
        left: 100,
        top: 100
    };

    @ViewChild('chessChild')
    public chessChild: ElementRef;
    @ViewChild('chessParent')
    public chessParent: ElementRef;

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
        this.preloader = true;
        this.service.getHousesChess().subscribe(
            (data) => {
                this.chess = data;
                this.routerEvent = this.routerChange();
            },
            (err) => {
                console.log(err);
                this.router.navigate(['/error-404'], {
                    skipLocationChange: true
                });
            }
        );
    }

    public routerChange() {
        return this.activatedRoute.queryParams.subscribe((params) => {
            // Если номера домов не менялись отменяем формирование схемы
            this.preloader = true;
            if (this.defaultParams && this.defaultParams === params.houses) { return; }

            this.houseNumbers = (params.houses).split(',');
            this.defaultParams = params.houses;

            if (this.houseNumbers.every( house => this.chess[house] )) {
                if (this.platform.isBrowser) {
                    if (this.searchFlats) {
                        setTimeout(() => {
                            this.searchFlatsSelection();
                        }, 100);
                    }
                    this.scrollCalculate();
                }
            } else {
                this.router.navigate(['/error-404'], {
                    skipLocationChange: true
                });
            }
        });
    }

    public searchFlatsSelection() {
        this.houseNumbers.forEach((house) => {
            this.chess[house].forEach((section: IFLatDisabled[][]) => {
                if (!section) { return; }
                section.forEach((floor: IFLatDisabled[]) => {
                    floor.forEach((flat: IFLatDisabled) => {
                        flat.disabled = true;
                        flat.discount = this.flatsDiscountService.getDiscount(flat);
                        this.searchFlats.forEach((searchFlat: IFlatWithDiscount) => {
                            if (searchFlat.articleId === flat.articleId
                                || flat.status === '8') {
                                flat.disabled = false;
                            }
                        });
                    });
                });
            });
        });
        this.preloader = false;
        this.ref.detectChanges();
    }

    public getFlats(sections, houses) {
        return this.service.getObjects({
            houses,
            sections
        });
    }

    public openApartmentModal(index, floorFlats) {
        const flatData = floorFlats.find((el,j) => j === index);
        sessionStorage.setItem('ntm-prev-route', JSON.stringify({ route: this.router.url.split('?')[0], params: this.activatedRoute.snapshot.queryParams }));
        this.router.navigate([`/flats/house/${flatData.house}/section/${flatData.section}/floor/${flatData.floor}/flat/${flatData.flat}`]);
    }

    public showFlatBubble(event, flat, sectionContainer) {
        const bubbleHeight = flat.discount ? 312 : 288;
        const offsetTop = event.target.getBoundingClientRect().top - sectionContainer.getBoundingClientRect().top;
        this.bubbleCoords.top = (bubbleHeight > (offsetTop + 100)) || (bubbleHeight > event.target.getBoundingClientRect().top) ? event.target.getBoundingClientRect().top : event.target.getBoundingClientRect().top - bubbleHeight + 30;
        this.bubbleCoords.left = event.target.getBoundingClientRect().left + 40;
        this.bubbleData = flat;
        this.showBubble = true;
    }
    public showFloorBubble(event, floor, i) {
        const coords = event.target.getBoundingClientRect();
        const offsetTop = event.target.offsetTop;
        const screenWidth = document.body.clientWidth;
        const bubbleWidth = 160;
        const bubbleHeight = 55;
        this.bubbleCoords.top = (bubbleHeight > offsetTop) || (bubbleHeight > coords.top) ? coords.top : coords.top - bubbleHeight + 30;
        this.bubbleCoords.left = (coords.left + 40 + bubbleWidth > screenWidth) ? (coords.left - bubbleWidth - 40) : (coords.left + 40) ;
        this.floorBubble = { flats: floor.filter(el => el && el.status === '4').length, count: i };
        this.floorShowBubble = true;
    }

    public ngAfterViewInit() {
        this.scrollCalculate();
        this.ref.detectChanges();
    }

    public scrollCalculate() {
        setTimeout(() => {
            this.scroll = 0;
            this.chessMaxScroll = this.chessChild.nativeElement.clientWidth - this.chessParent.nativeElement.clientWidth;
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

    public floorEmitted() {
        if (this.floorClicked) { return; }
        this.floorClicked = true;
        setTimeout(() => this.floorClicked = false, 3000);
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
}
