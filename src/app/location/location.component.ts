import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-location',
    templateUrl: './location.component.html',
    styleUrls: ['./location.component.scss']
})

export class LocationComponent {
    constructor(
        public router: Router
    ) {
    }
}
