import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IDecorationFurniture, IDecorationType, IDecorationVendor } from '../../../../../serv-files/serv-modules/decoration-api/decoration.interfaces';
import { FurnitureSliderService } from './furniture-slider.service';

@Component({
    selector: 'app-furniture-slider',
    templateUrl: 'furniture-slider.component.html',
    styleUrls: ['./furniture-slider.component.scss'],
    providers: [FurnitureSliderService]
})

export class FurnitureSliderComponent implements OnInit {

    public routerParams: any;
    public routerSubscr;
    public routerParamsVerified = false;

    public typeList: IDecorationType[];
    public vendorList: IDecorationVendor[];
    public furnitureList: IDecorationFurniture[];
    public furnitureItem: IDecorationFurniture;

    public slideCount = 0;
    public navList = [
        { name: 'Шатура', link: 'shatura' },
        { name: 'Лазурит', link: 'lazurit' },
        // { name: 'Хофф', link: 'hoff' },
    ];

    constructor(
        private furnitureSliderService: FurnitureSliderService,
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        this.furnitureSliderService.getDecorationFurnitureData()
            .subscribe(
                (data) => {
                    console.log('data: ', data);
                    this.typeList = data;
                    this.routerParamsSubscr();
                },
                (err) => console.error(err)
            );
    }

    private routerParamsSubscr() {
        this.routerParams = this.activatedRoute.snapshot.params;
        this.routerSubscr = this.activatedRoute.params.subscribe( params => {
            this.routerParams = { ...params };
            this.slideCount = 0;
            this.validateParams();
            if (this.routerParamsVerified && !this.furnitureItem.images) {
                this.navigate('room', 0);
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


    public btnNext() {
        this.slideCount = this.slideCount < (this.slides.length - 1) ? (this.slideCount + 1) : 0;
    }
    public btnPrev() {
        this.slideCount = this.slideCount > 0 ? (this.slideCount - 1) : (this.slides.length - 1); }
}
