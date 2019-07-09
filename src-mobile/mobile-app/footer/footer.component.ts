import { WindowScrollLocker } from '../commons/window-scroll-block';
import { VideoModalService } from '../modal/video-modal/video-modal.service';
import { OverlayService } from '../modal/overlay.service';
import { Component, OnInit } from '@angular/core';

declare let $: any;

@Component({
    selector : 'app-footer',
    templateUrl : './footer.component.html',
    styleUrls : ['./footer.component.scss'],
    providers: [
        WindowScrollLocker,
        VideoModalService
    ]
})

export class FooterComponent implements OnInit {

    constructor(
        private windowScrollLocker: WindowScrollLocker,
        private videoModalService: VideoModalService,
        private overlayService: OverlayService
    ) { }

    ngOnInit() {
        $('[data-show-video-js]').click(function () {

            $('.overlay').fadeIn(function () {

                $('.modal-video').fadeIn();
            })
        });

        $('.overlay').click(function () {

            $('.modal-video, .modal-plan').fadeOut(function () {

                $('.overlay').fadeOut();
            })
        });
    }

    openVideo() {
        this.overlayService.changeOverlayVisibility(true);
        this.videoModalService.changeVideoVisibility(true);
        this.windowScrollLocker.block();
    }

}
