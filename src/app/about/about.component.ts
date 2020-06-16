import { Component, OnInit, AfterViewInit } from '@angular/core';
import { WindowScrollLocker } from '../commons/window-scroll-block';

@Component({
    selector: 'app-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss'],
    providers : [ WindowScrollLocker ]
})

export class AboutComponent implements OnInit, AfterViewInit {

    public preloader = false;

    constructor( private scrollLock: WindowScrollLocker) { }

    public ngOnInit() {
        this.preloader = true;
        this.scrollLock.block();
    }

    ngAfterViewInit() {
        setTimeout(_ => {
            this.preloader = false;
            this.scrollLock.unblock();
        });
    }
}
