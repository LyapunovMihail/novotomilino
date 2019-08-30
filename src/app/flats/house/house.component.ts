import { IAddressItemFlat, IFlatWithDiscount } from '../../../../serv-files/serv-modules/addresses-api/addresses.interfaces';
import { FlatsDiscountService } from '../../commons/flats-discount.service';
import { WindowScrollLocker } from '../../commons/window-scroll-block';
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

declare const $: any;

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

    public freeFlats: any;

    public houseNumber: string;
    public sectionNumber: string;
    public sectionData: IFlatWithDiscount[][] = null;
    public flatData: IFlatWithDiscount;
    public routerEvent;
    public activeLink: string = '';
    public hoverSection: string = ''; // change on floor hover
    public hoverFloor: string = ''; // change on floor hover
    public highlight: boolean;
    public showApartmentWindow = false;
    public selectedFlatIndex: number;
    public floorFlats: IFlatWithDiscount[];

    public bubbleCoords: IFlatBubbleCoordinates = {
        left: 100,
        top: 100
    };
    public bubbleData = [];

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        public service: HouseService,
        private flatsDiscountService: FlatsDiscountService,
        public windowScrollLocker: WindowScrollLocker,
        private platform: PlatformDetectService,
    ) {
        this.highlight = false;
    }

    public ngOnInit() {
        this.routerEvent = this.routerChange();
    }

    public routerChange() {
        return this.activatedRoute.params.subscribe((params) => {
            if ((/^[1|2|3|4]$/).exec(params['house'])) {
                this.highlight = false;
                this.houseNumber = this.activatedRoute.snapshot.params['house'];
                this.sectionNumber = this.activatedRoute.snapshot.params['section'];
                this.activeLink = this.houseNumber;
                if (this.platform.isBrowser) {
                    // получение квартир для нужных секций
                    this.getFlats().subscribe(
                        (flats) => {
                            // инициализация ховера по этажам
                            console.log('data: ', flats);
                            this.buildSectionData(flats);
                            this.floorHoverInit(flats);
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

    public floorHoverInit(data) {
        let that = this;
        $('#house-svg-scheme').on('mouseenter', '.select-floor_svg_content_item', function(e) {
            // при наведении на этаж
            // получаем значение этажа и секции из атрибута 'data'
            that.hoverSection = that.replaceOnlyNum($(this).attr('data').split('_')[1]);
            that.hoverFloor = that.replaceOnlyNum($(this).attr('data').split('_')[2]);
            // в этаже находим кружок
            let circle = $(this).find('.select-floor_svg_content_item_circle');
            // по которому центрируется всплывающее окошко
            that.bubbleCoords = {
                top: circle.offset().top,
                left: circle.offset().left
            };
            // далее собираем данные для всплывающего окошка
            that.bubbleData = [
                // заготовка для кол-ва квартир по каждой комнатности
                {
                    name: 1,
                    count: 0
                },
                {
                    name: 2,
                    count: 0
                },
                {
                    name: 3,
                    count: 0
                },
                {
                    name: 0,
                    count: 0
                }
            ].map((item) => {
                // чистим общий массив по нужной секции и этажу
                data.filter((flat) => flat.section === that.hoverSection && flat.floor === Number(that.hoverFloor))
                // и для каждой квартиры в зависимости от кол-ва комнат
                // увеличиваем счетчик
                    .forEach((flat) => {
                        item.count = (Number(flat.rooms) === item.name) ?
                            item.count + 1 :
                            item.count;
                    });
                return item;
                // счетчики с нулями удаляем
            }).filter((item) => item.count > 0);
        });
        // при уходе курсора с этажа, всплывающее окошко исчезает
        $('#house-svg-scheme').on('mouseleave', '.select-floor_svg_content_item', function (e) {
            // потому что оно видно когда этаж и секция определены
            that.hoverSection = null;
            that.hoverFloor = null;
        });
    }

    public buildSectionData(flats) {
        this.sectionData = flats.reduce((section: IFlatWithDiscount[][], flat: IAddressItemFlat) => {
            if (!section[flat.floor] && flat.floor !== 0) { // Убрать проверки на нулевой этаж барвихи
                section[flat.floor] = [];
            }
            if (flat.floor !== 0) {
                section[flat.floor].push({...flat, discount: this.flatsDiscountService.getDiscount(flat)});
            } // Убрать проверки на нулевой этаж барвихи
            return section;
        }, []);

        this.sectionData.reverse();

        this.sectionData.map((floor: IAddressItemFlat[]) => {
            floor.sort();
        });
        console.log('this.sectionData: ', this.sectionData);
    }

    public replaceOnlyNum(str) {
        return str.replace(/[^0-9]/gim, '');
    }

    public getFlats() {
        return this.service.getObjects({
            house: this.houseNumber,
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


}
