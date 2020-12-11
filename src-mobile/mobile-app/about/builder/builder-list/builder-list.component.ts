import { Component, Input, OnInit } from '@angular/core';
import { PROJECT_MARKERS } from '../../about.markers';

@Component({
    selector: 'app-builder-list',
    templateUrl: 'builder-list.component.html',
    styleUrls: ['./builder-list.component.scss']
})

export class BuilderListComponent implements OnInit {

    @Input() public projects;
    @Input() public filter;
    public uploadPath = `//3-red.com/uploads/object/`;
    // Локально картинки не будут работать, тк ссылка идет до сайта тройки аббсолютно

    constructor() { }

    ngOnInit() { }

    public get filteredProject() {
        if (!this.projects || !this.projects.length) { return []; }
        return this.filter === 'ilike'
            ? this.projects.filter(el => el.ilike && el.name !== 'Новотомилино')
            : this.projects.filter(el => el.name !== 'Новотомилино');
    }
}
