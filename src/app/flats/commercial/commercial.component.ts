import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-commercial',
    templateUrl: 'commercial.component.html',
    styleUrls: ['./commercial.component.scss']
})

export class CommercialComponent implements OnInit {

    public navList = [
        { name: 'Список', link: '/flats/commercial/list' },
        { name: 'Генплан', link: '/flats/commercial/plan' }
    ];
    constructor( public router: Router ) { }

    ngOnInit() { }

    public showHead() {
        if (this.router.url === '/flats/commercial/list'
            || this.router.url === '/flats/commercial/plan') { return true; }

        return false;
    }
}
