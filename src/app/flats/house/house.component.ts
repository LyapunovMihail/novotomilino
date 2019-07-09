import {
    IFloorBubbleCoordinates
} from './floor-bubble/floor-bubble.component';
import {
    HOUSES_IMAGE_AND_SVG
} from './house-svg';
import {
    HouseService
} from './house.service';
import {
    Router
} from '@angular/router';
import {
    Component,
    OnInit,
    ViewEncapsulation,
    Input
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
    providers: [HouseService]
})

export class HouseComponent implements OnInit {

    public freeFlats: any;

    public houseResources: any = null; // image and svg for floor hover
    public activeLink: string = '';
    public hoverSection: string = ''; // change on floor hover
    public hoverFloor: string = ''; // change on floor hover
    public highlight: boolean;

    public bubbleCoords: IFloorBubbleCoordinates = {
        left: 100,
        top: 100
    };
    public bubbleData = [];

    constructor(
        private router: Router,
        public service: HouseService,
        private platform: PlatformDetectService,
    ) {
        this.highlight = false;
    }

    public ngOnInit() {
        this.highlight = false;
        this.houseResources = HOUSES_IMAGE_AND_SVG;
        // отписка от кликов и ховеров
        this.unsubscribeFromDomEvents();
        if (this.platform.isBrowser) {
            // получение квартир для нужных секций
            this.getFlats().subscribe(
                (data) => {
                    // удаление этажей для которых нет квартир
                    // this.removeEmptyFloors(data);

                    // инициализация клика по этажам
                    this.floorClickInit();
                    // инициализация ховера по этажам
                    this.floorHoverInit(data);

                    this.freeFlats = this.service.createFreeFlats(data);
                },
                (err) => {
                    console.log(err);
                });
        }
    }

    public removeEmptyFloors(data) {
        if (this.platform.isBrowser) {
            // class="select-floor_svg_content_item" data="k-2_s-6_fl-17"
            const floorsElems = document.querySelectorAll('.select-floor_svg_content_item');
            Array.prototype.forEach.call(floorsElems, (elem) => {
                const section = this.replaceOnlyNum($(elem).attr('data').split('_')[0]);
                const floor = this.replaceOnlyNum($(elem).attr('data').split('_')[1]);
                const flatsCount = data.filter((item) => item.floor === Number(floor) && item.section === section && item.status === '4').length;
                if (flatsCount === 0) {
                    elem.remove();
                }
            });
        }
    }

    public floorClickInit() {
        const that = this;
        $('#house-svg-scheme').on('click', '.select-floor_svg_content_item', function(e) {
            const data = $(this).attr('data');
            if (data) {
                that.svgRouterLink(null, url(data));
            }
        });

        function url(data) {
            return (`/flats/${data.split('_')
            .map((item) => that.replaceOnlyNum(item))
            .reduce((prev, cur, i) => (
                (i === 0) ? `section/${cur}`
                : `section/${prev}/floor/${cur}`
            ))}`);
        }
    }

    public floorHoverInit(data) {
        const that = this;
        $('#house-svg-scheme').on('mouseenter', '.select-floor_svg_content_item', function(e) {
            // при наведении на этаж
            // получаем значение этажа и секции из атрибута 'data'
            that.hoverSection = that.replaceOnlyNum($(this).attr('data').split('_')[0]);
            that.hoverFloor = that.replaceOnlyNum($(this).attr('data').split('_')[1]);
            // в этаже находим кружок
            const circle = $(this).find('.select-floor_svg_content_item_circle');
            // по которому центрируется всплывающее окошко
            that.bubbleCoords = {
                top: circle.offset().top,
                left: circle.offset().left
            };
            // далее собираем данные для всплывающего окошка
            that.bubbleData = [
                // заготовка для кол-ва квартир по каждой комнатности
                {
                    name: 0,
                    count: 0
                },
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
                }

            ].map((item) => {
                // чистим общий массив по нужной секции и этажу
                data.filter((flat) => flat.section === Number(that.hoverSection) && flat.floor === Number(that.hoverFloor))
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
        $('#house-svg-scheme').on('mouseleave', '.select-floor_svg_content_item', function(e) {
            // потому что оно видно когда этаж и секция определены
            that.hoverSection = null;
            that.hoverFloor = null;
        });
    }

    public replaceOnlyNum(str) {
        return str.replace(/[^0-9]/gim, '');
    }

    public getFlats() {
        return this.service.getObjects({
            sections: '1,2,3,4'
        });
    }

    public unsubscribeFromDomEvents() {
        // отписка от событий dom
        if (this.platform.isBrowser) {
            $('#house-svg-scheme').off('click');
            $('#house-svg-scheme').off('mouseenter');
            $('#house-svg-scheme').off('mouseleave');
        }
    }

    public svgRouterLink(event: Event, url) {
        if (event) {
            event.preventDefault();
        }
        this.router.navigate([url]);
    }

    public floorWithFreeFlats(section: number, floor: number): boolean {
        if (this.freeFlats === undefined ||
            this.freeFlats[String(section)] === undefined ||
            this.freeFlats[String(section)][String(floor)] === undefined
        ) {
            return false;
        } else {
            return true;
        }
    }

    public highlightFloors(): void {
        if (this.platform.isBrowser) {
            const floors = document.querySelectorAll('.house__svg__floor_in-sale');

            this.highlight = !this.highlight;

            Array.prototype.forEach.call(floors, (item) => {
              this.highlight
                ? item.classList.add('highlight')
                : item.classList.remove('highlight');
            });
        }
    }
}
