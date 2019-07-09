import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-decoration-slider-nav-item',
    templateUrl: './decoration-slider-nav-item.component.html',
    styleUrls: ['./decoration-slider-nav-item.component.scss']
})

export class DecorationSliderNavItemComponent {
    @Input() itemName: string;
    @Input() isActive: boolean;
}
