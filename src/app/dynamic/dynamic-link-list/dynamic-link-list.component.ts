import { PlatformDetectService } from './../../platform-detect.service';
import { IDynamicObject } from '../../../../serv-files/serv-modules/dynamic-api/dynamic.interfaces';
import { AfterViewInit, ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { SVGLINKS } from './svgLinks';
import { DynamicLinkListService } from './dynamic-link-list.service';
declare let $: any;

@Component({
    selector: 'app-dynamic-link-list',
    templateUrl: './dynamic-link-list.component.html',
    styleUrls: ['./dynamic-link-list.component.scss'],
    providers: [
        PlatformDetectService,
        DynamicLinkListService
    ]
})

export class DynamicLinkListComponent implements OnInit, OnChanges, AfterViewInit {

    public linksArray: any[];

    @Input() month: number;
    @Input() year: number;
    @Input() objectsArray: IDynamicObject[] = [];

    constructor(
        public platform: PlatformDetectService,
        private dynamicLinkListService: DynamicLinkListService,
        public ref: ChangeDetectorRef
    ) { }

    public ngOnInit() {
        this.setLinksData();
    }

    ngAfterViewInit() {
        this.dynamicLinkListService.fillReadySegments(this.linksArray, true);
    }

    ngOnChanges(changes: SimpleChanges) {
        this.setLinksData();
        this.ref.detectChanges();
        this.dynamicLinkListService.fillReadySegments(this.linksArray, true);
    }

    // скролл до якоря
    public scrollLink(link, year, month) {
        if (!this.platform.isBrowser) { return false; }
        if (year !== this.year && month !== this.month) { return false; }

        let destination = $(`#${link}`).offset().top;
        $('html:not(:animated),body:not(:animated)').animate({ scrollTop: destination - 30 }, 500);
        return false;
    }

    private setLinksData() {
        this.linksArray = JSON.parse(JSON.stringify(SVGLINKS)); // Копирование массива
        this.objectsArray.forEach((obj) => {
            if (obj.year !== this.year || obj.month !== this.month) { return; }
            if (obj.title.toLowerCase().indexOf('детский сад') !== -1) {
                this.linksArray[0] = {...obj, ...this.linksArray[0]};
                this.linksArray[0].ready.value = obj.ready;
                this.linksArray[0]._id = obj._id;
            } else if (obj.title.indexOf('1') !== -1) {
                this.linksArray[1] = {...obj, ...this.linksArray[1]};
                this.linksArray[1].ready.value = obj.ready;
                this.linksArray[1]._id = obj._id;
            } else if (obj.title.indexOf('2') !== -1) {
                this.linksArray[2] = {...obj, ...this.linksArray[2]};
                this.linksArray[2].ready.value = obj.ready;
                this.linksArray[2]._id = obj._id;
            } else if (obj.title.indexOf('3') !== -1) {
                this.linksArray[3] = {...obj, ...this.linksArray[3]};
                this.linksArray[3].ready.value = obj.ready;
                this.linksArray[3]._id = obj._id;
            } else if (obj.title.indexOf('4') !== -1) {
                this.linksArray[4] = {...obj, ...this.linksArray[4]};
                this.linksArray[4].ready.value = obj.ready;
                this.linksArray[4]._id = obj._id;
            }
        });
    }
}
