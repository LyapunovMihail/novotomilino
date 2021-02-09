import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { MetaRenderAdminService } from './render-meta-admin.service';

@Component({
    selector: 'app-news-shares',
    template: `
        <ng-content></ng-content>
    `,
    styleUrls: ['./news-shares.component.scss'],
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
