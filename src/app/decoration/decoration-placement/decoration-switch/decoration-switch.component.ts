import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-decoration-switch',
    templateUrl: './decoration-switch.component.html',
    styleUrls: ['./decoration-switch.component.scss']
})

export class DecorationSwitchComponent {

    @Input() pageType: string;
}
