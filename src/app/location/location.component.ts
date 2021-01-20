import { Component } from '@angular/core';

@Component({
    selector: 'app-location',
    template: `
        <section class="location">
            <ng-content></ng-content>
        </section>
    `,
    styleUrls: ['./location.component.scss']
})

export class LocationComponent {

    constructor () {}

}
