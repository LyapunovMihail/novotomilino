import { Component, Input, OnInit } from '@angular/core';
import { IFlatFurniture, IFlatFurnitureItem } from '../../../../../serv-files/serv-modules/addresses-api/addresses.interfaces';
import { WindowScrollLocker } from '../../../commons/window-scroll-block';

@Component({
    selector: 'app-apartment-furniture',
    templateUrl: 'apartment-furniture.component.html',
    styleUrls: ['./apartment-furniture.component.scss'],
    providers: [WindowScrollLocker]
})

export class ApartmentFurnitureComponent implements OnInit {

    public furnitureVariant: IFlatFurniture;
    public furnitureImages = [];
    public totalCost: number;

    public isSlideShow = false;

    @Input() public furniture: IFlatFurniture[];
    @Input() public isActive: boolean;

    get fixedInPriceItems(): IFlatFurnitureItem[] {
        return this.furnitureVariant.items.filter((item) => item.itemsDefaultCount === 999);
    }

    constructor(
        public windowScrollLocker: WindowScrollLocker
    ) {}

    ngOnInit() {
        this.furnitureVariant = this.furniture[0];
        this.totalCost = this.furnitureVariant.charCost;
    }

    public calculateTotalPrice(e, item) {
        this.totalCost = e.target.checked ? this.totalCost + item.itemPrice : this.totalCost - item.itemPrice;
    }

    public startSlideShow() {
        if (this.furnitureVariant.charImages) {
            this.windowScrollLocker.block();
            this.isSlideShow = true;
        }
    }
}
