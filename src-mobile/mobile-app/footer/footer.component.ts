import { WindowScrollLocker } from '../commons/window-scroll-block';
import { OverlayService } from '../modal/overlay.service';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
    selector : 'app-footer',
    templateUrl : './footer.component.html',
    styleUrls : ['./footer.component.scss'],
    providers: [
        WindowScrollLocker
    ]
})

export class FooterComponent implements OnInit {

    public isHidden = false;

    constructor(
        private windowScrollLocker: WindowScrollLocker,
        private overlayService: OverlayService,
        private router: Router
    ) { }

    ngOnInit() {

        this.router.events
            .subscribe((event) => {
                if (event instanceof NavigationEnd) {
                    if (this.router.url === '/quarantine') {
                        this.isHidden = true;
                        document.body.style.background = '#f5f5f5';
                    }
                }
            });
    }

    openVideo() {
        this.overlayService.changeOverlayVisibility(true);
        this.windowScrollLocker.block();
    }

}
