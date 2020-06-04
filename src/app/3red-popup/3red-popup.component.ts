import { Component, OnInit } from '@angular/core';
import { WindowScrollLocker } from '../commons/window-scroll-block';

@Component({
    selector: 'app-3red-popup',
    templateUrl: '3red-popup.component.html',
    styleUrls: ['./3red-popup.component.scss'],
    providers: [ WindowScrollLocker ]
})

export class RedPopupComponent implements OnInit {

    public isOpen = false;

    constructor( public scrollLock: WindowScrollLocker ) { }

    ngOnInit() {

        setTimeout( () => {

            this.isOpen = true;
            this.scrollLock.block();
        }, 6000);
    }

    close() {

        this.isOpen = false;
        this.scrollLock.unblock();
    }
}
