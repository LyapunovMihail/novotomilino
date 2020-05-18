import { Component, OnDestroy, OnInit } from '@angular/core';
import { MetaTagsRenderService } from '../seo/meta-tags-render.service';

@Component({
    selector: 'app-purchase',
    templateUrl: './purchase.component.html',
    styleUrls: ['./purchase.component.scss']
})

export class PurchaseComponent implements OnInit, OnDestroy {
    public showDetails = false;

    public title = 'Условия покупки';
    public titleEvent;

    constructor(
        private metaTagsRenderService: MetaTagsRenderService
    ) {}

    ngOnInit() {
        this.titleEvent = this.metaTagsRenderService.getH1().subscribe((updatedTitle) => {
            this.title = updatedTitle;
        });

    }

    ngOnDestroy() {
        this.titleEvent.unsubscribe();
    }
}
