import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IFlatWithDiscount } from '../../../../serv-files/serv-modules/addresses-api/addresses.interfaces';

@Component({
    selector: 'app-flat-snippet',
    template: `
        <app-flat-favorite-snippet
            *ngIf="favoriteSnippet && viewType === 'block'"
            (close)="closeFavorite.emit()"
        ></app-flat-favorite-snippet>

        <ng-container *ngIf="!favoriteSnippet">
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
        </ng-container>
    `
})

export class FlatSnippetComponent {

    @Input() public index: number;
    @Input() public viewType: 'block' | 'inline';
    @Input() public flatData: IFlatWithDiscount;
    @Input() public flatsCount: number;

    @Output() public closeFavorite = new EventEmitter<any>();

    public get favoriteSnippet() { return this.flatData.type === 'favorite'; }
}
