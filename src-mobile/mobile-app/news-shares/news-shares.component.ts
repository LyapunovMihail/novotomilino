import {Component, ViewEncapsulation} from '@angular/core';

@Component({
    selector: 'app-news-shares',
    template: `
        <router-outlet></router-outlet>
        <app-info-block></app-info-block>`,
    styleUrls: ['./news-shares.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class NewsSharesComponent {
}
