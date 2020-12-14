import { Component, Input, OnInit } from '@angular/core';
import { IFlatWithDiscount } from '../../../../../serv-files/serv-modules/addresses-api/addresses.interfaces';
import { furnitureVariant } from './config';

@Component({
    selector: 'app-apartment-furniture',
    templateUrl: 'apartment-furniture.component.html',
    styleUrls: ['./apartment-furniture.component.scss']
})

export class ApartmentFurnitureComponent implements OnInit {

    public furnitureVariant = furnitureVariant;
    public furnitureImages = [];

    @Input() public flatData: IFlatWithDiscount;
    @Input() public isActive: boolean;

    constructor() { }

    ngOnInit() { }
}
