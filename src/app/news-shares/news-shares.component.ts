import {Component, OnDestroy, ViewEncapsulation} from '@angular/core';
import { MetaRenderAdminService } from './render-meta-admin.service';

@Component({
    selector: 'app-news-shares',
    template: `
        <router-outlet></router-outlet>
        <app-info-block></app-info-block>
    `,
    styleUrls: ['./news-shares.component.scss'],
    providers: [ MetaRenderAdminService ],
    encapsulation: ViewEncapsulation.None
})

export class NewsSharesComponent implements OnDestroy {

    constructor(
        private metaAdminService: MetaRenderAdminService
    ) {}

    ngOnDestroy() {
        this.metaAdminService.unsubscribe();
    }
}
