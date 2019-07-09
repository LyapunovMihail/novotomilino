import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-decoration-slider-nav',
    templateUrl: './decoration-slider-nav.component.html',
    styleUrls: ['./decoration-slider-nav.component.scss']
})

export class DecorationSliderNavComponent {
    @Input() slideList: any[] = [];
    @Input() activeIndex: number = 0;
    @Output() changeIndex: EventEmitter<number> = new EventEmitter();
}
