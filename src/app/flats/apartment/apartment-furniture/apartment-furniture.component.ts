import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { IFlatFurniture, IFlatFurnitureItem } from '../../../../../serv-files/serv-modules/addresses-api/addresses.interfaces';
import { WindowScrollLocker } from '../../../commons/window-scroll-block';

@Component({
    selector: 'app-apartment-furniture',
    templateUrl: 'apartment-furniture.component.html',
    styleUrls: ['./apartment-furniture.component.scss'],
    providers: [WindowScrollLocker]
})

export class ApartmentFurnitureComponent implements OnInit, OnDestroy {

    public furnitureVariant: IFlatFurniture;
    public furnitureImages = [];
    public totalCost: number;

    public isSlideShow = false;

    @Input() public furniture: IFlatFurniture[];
    @Input() public isActive: boolean;
    @Output() public changeFurnitureCost = new EventEmitter<number>();

    get fixedInPriceItems(): IFlatFurnitureItem[] {
        return this.furnitureVariant.items.filter((item) => item.itemsDefaultCount === 999);
    }

    constructor(
        public windowScrollLocker: WindowScrollLocker
    ) {}

    ngOnInit() {
        this.furnitureVariant = this.furniture[0];
        this.totalCost = this.furnitureVariant.charCost;
        this.changeFurnitureCost.emit(this.totalCost);
    }

    public calculateTotalPrice(e, item) {
        this.totalCost = e.target.checked ? this.totalCost + item.itemPrice : this.totalCost - item.itemPrice;
        this.changeFurnitureCost.emit(this.totalCost);
    }

    public startSlideShow() {
        this.furnitureVariant.charImages = [{"url":"https://incrm.ru/DOC/TRED/plans/ntm_meb/test.jpg"},{"url":"https://incrm.ru/DOC/TRED/plans/ntm_meb/shatura_ntm_st_11.jpg"},{"url":"https://incrm.ru/DOC/TRED/plans/ntm_meb/test.jpg"},{"url":"https://incrm.ru/DOC/TRED/plans/ntm_meb/test.jpg"}];

        if (this.furnitureVariant.charImages) {
            this.windowScrollLocker.block();
            this.isSlideShow = true;
        }
    }

    ngOnDestroy() {
        this.changeFurnitureCost.emit(0);
    }
}
