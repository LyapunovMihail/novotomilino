import { PlatformDetectService } from './../../../platform-detect.service';
import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
declare const $: any;

export interface IFloorBubbleCoordinates {
    top: number;
    left: number;
}

@Component({
    selector: 'app-flats-floor-bubble',
    templateUrl: './floor-bubble.component.html',
    styleUrls: ['./floor-bubble.component.scss']
})

export class FloorBubbleComponent implements OnChanges {

    @Input() public coords: IFloorBubbleCoordinates;
    @Input() public floor: string;
    @Input() public section: string;
    @Input() public bubbleData: any[] = [];

    public bubbleLeft: number;
    public bubbleTop: number;
    public transformLeft: boolean = false;
    public totalFlats = 0;

    constructor(
        public platform: PlatformDetectService
    ) {}

    ngOnChanges(changes: SimpleChanges) {
        if ( !this.platform.isBrowser ) { return false; }
        this.transformLeft = ( this.section === '1' );
        this.bubbleLeft = this.coords.left + 30;
        this.bubbleTop = this.coords.top;

        this.totalFlats = this.bubbleData.reduce((sum, current) => {
            return sum + current.count;
        }, 0);
    }
}
