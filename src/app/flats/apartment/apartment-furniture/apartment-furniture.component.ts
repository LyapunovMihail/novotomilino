import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { IFlatFurniture } from '../../../../../serv-files/serv-modules/addresses-api/addresses.interfaces';

@Component({
    selector: 'app-apartment-furniture',
    templateUrl: 'apartment-furniture.component.html',
    styleUrls: ['./apartment-furniture.component.scss']
})

export class ApartmentFurnitureComponent implements OnInit, OnChanges {

    public furnitureVariant: IFlatFurniture;
    public furnitureImages = [];

    @Input() public furniture: IFlatFurniture[];
    @Input() public isActive: boolean;

    constructor() { }

    ngOnInit() { }

    ngOnChanges(changes: SimpleChanges): void {
        if ('isActive' in changes && changes.isActive.currentValue === true) {
            if ('furniture' in changes) {
                this.furnitureVariant = changes.furniture.currentValue[0];
            }
        }
    }
}
