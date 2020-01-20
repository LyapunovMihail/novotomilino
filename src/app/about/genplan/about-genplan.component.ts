import { Component } from '@angular/core';
import { GENPLAN_MARKERS } from '../about.markers';

@Component({
    selector: 'app-about-genplan',
    templateUrl: './about-genplan.component.html',
    styleUrls: ['./about-genplan.component.scss', './../about.component.scss']
})

export class AboutGenplanComponent {

    public markers = GENPLAN_MARKERS;
}
