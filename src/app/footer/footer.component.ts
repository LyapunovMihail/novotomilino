import { WindowScrollLocker } from '../commons/window-scroll-block';
import { VideoModalService } from '../modal/video-modal/video-modal.service';
import { OverlayService } from '../modal/overlay.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { PlatformDetectService } from '../platform-detect.service';

@Component({
    selector : 'app-footer',
    templateUrl : './footer.component.html',
    styleUrls : ['./footer.component.scss'],
    providers: [
        WindowScrollLocker
    ]
})

export class FooterComponent implements OnInit, OnDestroy {

    public isHidden: boolean;
    private ngUnsubscribe: Subject<void> = new Subject<void>();

    constructor(
        private platform: PlatformDetectService,
        private windowScrollLocker: WindowScrollLocker,
        private videoModalService: VideoModalService,
        private overlayService: OverlayService,
        private router: Router
    ) { }

    public ngOnInit() {
        if (this.platform.isBrowser) {
            this.router.events
                .pipe(takeUntil(this.ngUnsubscribe))
                .subscribe((event) => {
                    if (event instanceof NavigationEnd) {
                        if (this.router.url.startsWith('/flats/plan')
                            || this.router.url.startsWith('/flats/_search')
                            || this.router.url === '/quarantine') {
                                this.isHidden = true;
                                document.body.style.padding = '0';
                        } else {
                            this.isHidden = false;
                            document.body.style.padding = '';
                        }
                    }
                });
        }
    }

    public ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    openVideo() {
        this.overlayService.changeOverlayVisibility(true);
        this.videoModalService.changeVideoVisibility(true);
        this.windowScrollLocker.block();
    }

}
