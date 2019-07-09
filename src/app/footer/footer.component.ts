import { WindowScrollLocker } from '../commons/window-scroll-block';
import { VideoModalService } from '../modal/video-modal/video-modal.service';
import { OverlayService } from '../modal/overlay.service';
import { Component } from '@angular/core';

@Component({
    selector : 'app-footer',
    templateUrl : './footer.component.html',
    styleUrls : ['./footer.component.scss'],
    providers: [
        WindowScrollLocker,
        VideoModalService
    ]
})

export class FooterComponent {

    constructor(
        private windowScrollLocker: WindowScrollLocker,
        private videoModalService: VideoModalService,
        private overlayService: OverlayService
    ) { }

    openVideo() {
        this.overlayService.changeOverlayVisibility(true);
        this.videoModalService.changeVideoVisibility(true);
        this.windowScrollLocker.block();
    }

}
