import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-commercial',
    templateUrl: './commercial.component.html',
    styleUrls: ['./commercial.component.scss']
})

export class CommercialComponent implements OnInit {

    public navList = [
        {
            name: 'Список',
            link: '/flats/commercial/list'
        }, {
            name: 'Секции',
            link: '/flats/commercial/section'
        }
    ];
    constructor( public router: Router ) { }

    ngOnInit() { }

    public activeRouter() {
        if (this.router.url === '/flats/commercial/list') { return 0; }
        if (this.router.url === '/flats/commercial/section') { return 1; }
    }

    public showHead() {
        if (this.router.url === '/flats/commercial/list'
            || this.router.url === '/flats/commercial/section') { return true; }

        return false;
    }
}
