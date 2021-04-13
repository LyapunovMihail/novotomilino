import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IDecorationFurnitureSlider, IDecorationFurnitureSnippet, IDecorationFurnitureVendor } from '../../../../serv-files/serv-modules/decoration-api/decoration.interfaces';
import { FurnitureSliderService } from './furniture-slider.service';
declare const Swiper: any;

@Component({
    selector: 'app-furniture-slider',
    templateUrl: 'furniture-slider.component.html',
    styleUrls: ['./furniture-slider.component.scss'],
    providers: [FurnitureSliderService]
})

export class FurnitureSliderComponent implements OnInit, AfterViewInit {

    public routerParams: any;
    public routerSubscr;
    public routerParamsVerified = false;

    public typeList: IDecorationFurnitureSlider[];
    public vendorList: IDecorationFurnitureVendor[];
    public furnitureList: IDecorationFurnitureSnippet[];
    public furnitureItem: IDecorationFurnitureSnippet;

    public slideCount = 0;

    private swiperSlider: any;

    public viewType: 'block' | 'inline' = 'block';

    constructor(
        private furnitureSliderService: FurnitureSliderService,
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        this.furnitureSliderService.getDecorationFurnitureSliderData()
            .subscribe(
                (data) => {
                    this.typeList = data;
                    this.routerParamsSubscr();
                },
                (err) => console.error(err)
            );
    }
    ngAfterViewInit() {
        setTimeout(() => this.swiperInit(), 1000);
    }
    private routerParamsSubscr() {
        this.routerParams = this.activatedRoute.snapshot.params;
        this.routerSubscr = this.activatedRoute.params.subscribe( params => {
            this.routerParams = { ...params };
            this.validateParams();
            if (this.routerParamsVerified && !this.furnitureItem.images) {
                this.navigate('room', 0);
            }
            if (this.swiperSlider) {
                setTimeout(() => {
                    this.swiperSlider.update();
                }, 100);
            }
        });
    }

    private validateParams() {
        const decorationType = this.typeList.find((data) => data.type === this.routerParams.type);
        if (!decorationType) {
            this.router.navigate(['/error-404'], {skipLocationChange: true});
            return;
        }
        this.vendorList = decorationType.vendors;
        const decorationVendor = this.vendorList.find((data) => data.vendor === this.routerParams.vendor);
        if (!decorationVendor) {
            this.router.navigate(['/error-404'], {skipLocationChange: true});
            return;
        }
        this.furnitureList = decorationVendor.furniture;
        this.furnitureItem = this.furnitureList.find((data) => data.rooms === Number(this.routerParams.room));
        if (!isFinite(Number(this.routerParams.room)) || !this.furnitureItem) {
            this.router.navigate(['/error-404'], {skipLocationChange: true});
            return;
        }

        this.routerParamsVerified = true;
    }

    public navigate(ctrl, val) {
        this.routerParams[ctrl] = val;
        this.router.navigate([`/decoration/furniture/type/${this.routerParams.type}/vendor/${this.routerParams.vendor}/room/${this.routerParams.room}`]);
    }

    public get slides() {
        return this.furnitureItem.images;
    }

    private swiperInit() {
        this.swiperSlider = new Swiper('.furniture-swiper', {
            speed: 700,
            loop: false,
            effect: 'fade',
            slideActiveClass: 'active',
            navigation: {
              nextEl: '.swiper-btn--next',
              prevEl: '.swiper-btn--prev'
            },
            on: {
                slideChange: () => this.slideCount = this.swiperSlider.realIndex
            }
        });
    }

    public parseText(num) {

        num = Math.abs(num) % 100;
        const words = ['квартира', 'квартиры', 'квартир'];
        const sum = num % 10;

        if (num > 10 && num < 20) { return words[2]; }
        if (sum > 1 && sum < 5) { return words[1]; }
        if (sum === 1) { return words[0]; }
        return words[2];
    }
}
