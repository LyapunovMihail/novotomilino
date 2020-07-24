import { Component, ElementRef, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AppState } from './app.service';
import { FlatsDiscountService } from './commons/flats-discount.service';
import { FavoritesService } from './favorites/favorites.service';
import { PlatformDetectService } from './platform-detect.service';
import { MetaTagsRenderService } from './seo/meta-tags-render.service';

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

      <section #container>

          <app-header></app-header>

          <router-outlet></router-outlet>

          <app-footer></app-footer>

      </section>

      <app-overlay></app-overlay>
      <app-img-modal></app-img-modal>
  `,
    providers: []
})
export class AppComponent implements OnInit {

    @ViewChild('container')
    public container: ElementRef;

    public previousUrl: string;
    public currentUrl: string;
    public showPopup;

    constructor(
        private platformDetectService: PlatformDetectService,
        public appState: AppState,
        private router: Router,
        public flatsDiscountService: FlatsDiscountService,
        private metaTagsRenderService: MetaTagsRenderService,
        public renderer: Renderer2,
        public favoritesService: FavoritesService
    ) {
        this.metaTagsRenderService.renderer = this.renderer;
    }

    public ngOnInit() {
        console.log('Initial App State', this.appState.state);

        // Подписываемся на событие смены маршрута роутера чтобы скроллить вверх страницы при смене маршрута
        this.router.events.subscribe((event) => {
            if (!(event instanceof NavigationEnd)) {
                return;
            }
            console.log('CHECKK');
            this.metaTagsRenderService.render(this.router.url, this.container);

            this.previousUrl = this.currentUrl;
            this.currentUrl = this.router.url;

            if ((this.previousUrl && this.previousUrl.startsWith('/flats/house')) && this.currentUrl.startsWith('/flats/house')) { // и пресекаем скролл если маршрут сменяется
                return;                                                   // на одной и той же странице дома (переключаются параметры поиска)
            }

            if (this.platformDetectService.isBrowser) {
                window.scrollTo(0, 0);
            }
        });

        // Загружаем акции для дальнейшего вычисления скидки по квартирам
        this.flatsDiscountService.getShares();
        // Загружаем избранные квартиры
        this.favoritesService.getFavoriteFlats();
    }
}
