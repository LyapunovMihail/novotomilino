import { Component, Input } from '@angular/core';

export interface IFlatBubbleCoordinates {
    top: number;
    left: number;
}

@Component({
    selector: 'app-flats-floor-bubble',
    templateUrl: './floor-bubble.component.html',
    styleUrls: ['./floor-bubble.component.scss']
})

export class FloorBubbleComponent {

    @Input() public bubbleData;
    @Input() public showBubble: boolean;
    @Input() public coords: IFlatBubbleCoordinates;

    public get freeFlats() {
        if (!this.bubbleData) { return 'Нет свободных квартир'; }
        return this.bubbleData.flats > 0
            ? `Свободных квартир: ${this.bubbleData.flats}`
            : 'Нет свободных квартир';
    }
}
