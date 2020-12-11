import { PROJECT_MARKERS, IProjectItem } from './../about.markers';
import { Component } from '@angular/core';
import { AboutBuilderService } from './about-builder.service';

@Component({
    selector: 'app-about-builder',
    templateUrl: './about-builder.component.html',
    styleUrls: ['./about-builder.component.scss', './../about.component.scss'],
    providers : [ AboutBuilderService ]
})

export class AboutBuilderComponent {

    public objects3red;
    public navList = [
        { name: 'ilike', link: 'ilike' },
        { name: 'Все', link: 'all' },
    ];
    public activePoint = 'ilike';

    constructor(
        private aboutBuilderService: AboutBuilderService
    ) { }

    ngOnInit() {
        this.getObjects();
    }

    private getObjects() {
        const location = window.location.href;
        const modeIndex = location.indexOf('localhost') >= 0 ? 'dev' : 'prod';
        this.aboutBuilderService.queryObjects(modeIndex).subscribe(data => {
            this.objects3red = data;
        });
    }
}
