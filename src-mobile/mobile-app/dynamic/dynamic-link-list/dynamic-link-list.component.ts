import { PlatformDetectService } from './../../platform-detect.service';
import { IDynamicObject } from '../../../../serv-files/serv-modules/dynamic-api/dynamic.interfaces';
import { Component, Input } from '@angular/core';
declare let $: any;

@Component({
    selector: 'app-dynamic-link-list',
    templateUrl: './dynamic-link-list.component.html',
    styleUrls: ['./dynamic-link-list.component.scss'],
    providers: [
        PlatformDetectService
    ]
})

export class DynamicLinkListComponent {

    @Input() month: number;
    @Input() year: number;
    @Input() objectsArray: IDynamicObject[] = [];

    constructor(
        public platform: PlatformDetectService
    ) { }

    // скролл до якоря
    public scrollLink(link) {
        if (!this.platform.isBrowser) { return false; }
        let destination = $(`#${link}`).offset().top;
        $('html:not(:animated),body:not(:animated)').animate({ scrollTop: destination - 120 }, 500);
        return false;
    }

}
