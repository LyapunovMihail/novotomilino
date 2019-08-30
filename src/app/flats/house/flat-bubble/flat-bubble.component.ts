import { IFlatWithDiscount } from '../../../../../serv-files/serv-modules/addresses-api/addresses.interfaces';
import { PlatformDetectService } from './../../../platform-detect.service';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

export interface IFlatBubbleCoordinates {
    top: number;
    left: number;
}

@Component({
    selector: 'app-flats-flat-bubble',
    templateUrl: './flat-bubble.component.html',
    styleUrls: ['./flat-bubble.component.scss']
})

export class FlatBubbleComponent implements OnChanges {

    @Input() public coords: IFlatBubbleCoordinates;
    @Input() public flatData: IFlatWithDiscount;

    public bubbleLeft: number;
    public bubbleTop: number;
    public transformLeft = false;

    constructor(
        public platform: PlatformDetectService,
    ) {}

    ngOnChanges(changes: SimpleChanges) {
        if ( !this.platform.isBrowser ) { return false; }
        this.transformLeft = ( this.flatData.flat === 1 );
        this.bubbleLeft = this.coords.left + 30;
        this.bubbleTop = this.coords.top;
    }
}
