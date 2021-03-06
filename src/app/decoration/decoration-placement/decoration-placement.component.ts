import { Component, Input, SimpleChanges, OnChanges } from '@angular/core';

@Component({
    selector: 'app-placement',
    templateUrl: './decoration-placement.component.html',
    styleUrls: ['./decoration-placement.component.scss']
})

export class DecorationPlacementComponent implements OnChanges {

    public activeIndex = 0;
    @Input() public slideList: string[];
    @Input() public name: string;
    @Input() public pageType: string;

    constructor(
    ) {}

    ngOnChanges(changes: SimpleChanges) {
        if ('pageType' in changes) {
            this.activeIndex = 0;
        }
    }
    
    noticeContent(): string {
        if (this.pageType === 'places') {
            return this.name;
        } else {
            switch (this.slideList.length) {
                case 2:
                    return this.activeIndex === 0
                        ? `${this.name}: Классика`
                        : `${this.name}: Модерн`;
                default:
                    return this.activeIndex <= 1
                        ? `${this.name}: Классика`
                        : `${this.name}: Модерн`;
            }
        }
    }
}
