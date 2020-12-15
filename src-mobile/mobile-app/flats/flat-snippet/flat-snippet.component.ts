import { Component, Input } from '@angular/core';
import { IFlatWithDiscount } from '../../../../serv-files/serv-modules/addresses-api/addresses.interfaces';

@Component({
    selector: 'app-flat-snippet',
    template: `
        <app-flat-snippet-inline
            [isFirst]="index === 0"
            [flatData]="flatData"
            *ngIf="viewType === 'inline'"
        ></app-flat-snippet-inline>

        <app-flat-snippet-block
            [index]="index"
            [flatData]="flatData"
            [isFirst]="index === 0"
            [flatsCount]="flatsCount"
            *ngIf="viewType === 'block'"
        ></app-flat-snippet-block>
    `
})

export class FlatSnippetComponent {

    @Input() public index: number;
    @Input() public viewType: 'block' | 'inline';
    @Input() public flatData: IFlatWithDiscount;
    @Input() public flatsCount: number;
}
