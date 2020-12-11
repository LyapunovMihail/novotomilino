import { Component, Input } from '@angular/core';
import { IFlatWithDiscount } from '../../../../serv-files/serv-modules/addresses-api/addresses.interfaces';

@Component({
    selector: 'app-flat-snippet',
    template: `
        <app-flat-snippet-inline
            [isFirst]="isFirst"
            [flatData]="flatData"
            *ngIf="viewType === 'inline'"
        ></app-flat-snippet-inline>

        <app-flat-snippet-block
            [index]="index"
            [isFirst]="isFirst"
            [flatData]="flatData"
            *ngIf="viewType === 'block'"
        ></app-flat-snippet-block>
    `
})

export class FlatSnippetComponent {

    @Input() public index: number;
    @Input() public isFirst: boolean;
    @Input() public viewType = 'inline';
    @Input() public flatData: IFlatWithDiscount;
}
