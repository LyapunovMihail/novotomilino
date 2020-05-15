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
      <app-authorization></app-authorization>
      <app-admin-contacts></app-admin-contacts>

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
        public metaService: MetaService
    ) {}

    public ngOnInit() {
        console.log('Initial App State', this.appState.state);

        if (!localStorage.popup) {
            localStorage.setItem('popup', 'true');
        }

        // Подписываемся на событие смены маршрута роутера чтобы скроллить вверх страницы при смене маршрута
        this.router.events.subscribe((event) => {
            if (!(event instanceof NavigationEnd)) {
              return;
            }
            this.previousUrl = this.currentUrl;
            this.currentUrl = this.router.url;
            this.metaService.changeMetaTag(this.router.url);
            if ((this.previousUrl && this.previousUrl.startsWith('/flats/house')) && this.currentUrl.startsWith('/flats/house')) { // и пресекаем скролл если маршрут сменяется
                return;                                                   // на одной и той же странице дома (переключаются параметры поиска)
            }
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
