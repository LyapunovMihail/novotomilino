import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AppState } from './app.service';
import { FlatsDiscountService } from './commons/flats-discount.service';
import { MetaService } from './commons/meta.service';

export const ROOT_SELECTOR = 'app-root';

@Component({
    selector: ROOT_SELECTOR,
    encapsulation: ViewEncapsulation.None,
    styleUrls: [
        './app.component.css'
    ],
    template: `

        <section>

            <app-header></app-header>

            <router-outlet></router-outlet>

            <app-footer></app-footer>

            <app-3red-popup *ngIf="showPopup"></app-3red-popup>

        </section>

        <app-overlay></app-overlay>
        <app-img-modal></app-img-modal>
    `,
    providers: [ MetaService ]
})
export class AppComponent implements OnInit {

    public previousUrl: string;
    public currentUrl: string;
    public showPopup;

    constructor(
        public appState: AppState,
        private router: Router,
        public flatsDiscountService: FlatsDiscountService,
        public metaService: MetaService,
    ) {}

    public ngOnInit() {
        console.log('Initial App State', this.appState.state);

        if (!localStorage.popup) {
            localStorage.setItem('popup', 'true');
        }

        this.router.events.subscribe((event) => {
            if (!(event instanceof NavigationEnd)) {
                return;
            }
            this.metaService.changeMetaTag(this.router.url);
            this.previousUrl = this.currentUrl;
            this.currentUrl = this.router.url;
            window.scrollTo(0, 0);
        });

        this.showOnePopup();
        // Загружаем акции для дальнейшего вычисления скидки по квартирам
        this.flatsDiscountService.getShares();
    }

    public showOnePopup() {

        if (localStorage.popup === 'true') {
            localStorage.popup = 'false';
            this.showPopup = true;
        }
    }
}
