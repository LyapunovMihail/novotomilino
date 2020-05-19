import { Component, OnInit, Output, EventEmitter, Renderer2, ElementRef } from '@angular/core';
import { WindowScrollLocker } from '../../commons/window-scroll-block';
import { HomeService } from '../home.service';

@Component({
    selector: 'app-video',
    styleUrls: ['./video.component.scss'],
    template: `
        <div class="video">
            <div class="video__container">
                <button class="video__btn-close" (click)="close.emit(false); this.scrollLock.unblock()"></button>
            </div>
        </div>`,
        // <iframe [src]="videoLink" frameborder="0"></iframe>
    providers: [ WindowScrollLocker ]
})

export class VideoComponent implements OnInit {

    @Output() public close = new EventEmitter<any>();
    public videoLink;
    constructor(
        public scrollLock: WindowScrollLocker,
        public homeService: HomeService,
        public renderer: Renderer2,
        public elRef: ElementRef
    ) { }

    ngOnInit() {
        this.scrollLock.block();

        this.homeService.getPreviewVideo().subscribe(
            data => {
                if (data) {
                    // this.parseLink(data.link);
                    this.createIframe(data.link);
                }
            },
            err => console.log(err)
        );
    }

    createIframe(link) {
        let iframe = this.renderer.createElement('iframe');
        let parent = this.elRef.nativeElement.querySelector('.video__container');

        this.renderer.setAttribute(iframe, 'src', this.parseLink(link));
        this.renderer.appendChild(parent, iframe);
    }

    public parseLink(link): any {
        if (link) {
            let arr = link.split('/');

            return `https://www.youtube.com/embed/${arr[arr.length - 1]}?autoplay=1&amp;controls=0`;
        }
    }

    callLogi(item) {

        console.log(item);
        return item;
    }

}
