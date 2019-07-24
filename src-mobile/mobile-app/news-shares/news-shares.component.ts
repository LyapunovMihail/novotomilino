import {Component, ViewEncapsulation} from '@angular/core';

@Component({
    selector: 'app-news-shares',
    template: `
        <ul>
            <li><a routerLink="/news-shares/all">Все</a></li>
            <li><a routerLink="/news-shares/news">Новости</a></li>
            <li><a routerLink="/news-shares/shares">Акции</a></li>
        </ul>
        <router-outlet></router-outlet>
    `,
    styleUrls: ['./news-shares.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class NewsSharesComponent {
}
