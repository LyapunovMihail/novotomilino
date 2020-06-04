import { Component, ElementRef, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AppState } from './app.service';
import { FlatsDiscountService } from './commons/flats-discount.service';
import { MetaTagsRenderService } from './commons/meta-tags-render.service';

export const ROOT_SELECTOR = 'app-root';

@Component({
    selector: ROOT_SELECTOR,
    encapsulation: ViewEncapsulation.None,
    styleUrls: [
        './app.component.css'
    ],
    template: `
        <section #container>

            <app-header></app-header>

            <router-outlet></router-outlet>

            <app-footer></app-footer>

        </section>

        <app-overlay></app-overlay>
        <app-img-modal></app-img-modal>
    `
})
export class AppComponent implements OnInit {

    @ViewChild('container')
    public container: ElementRef;

    public previousUrl: string;
    public currentUrl: string;

    constructor(
        public appState: AppState,
        private router: Router,
        public flatsDiscountService: FlatsDiscountService,
        private metaTagsRenderService: MetaTagsRenderService,
        public renderer: Renderer2
    ) {
        this.metaTagsRenderService.renderer = this.renderer;
    }

    public ngOnInit() {
        console.log('Initial App State', this.appState.state);

        if (!localStorage.popup) {
            localStorage.setItem('popup', 'true');
        }

        this.router.events.subscribe((event) => {
            if (!(event instanceof NavigationEnd)) {
                return;
            }
            this.metaTagsRenderService.render(this.router.url, this.container);

            this.previousUrl = this.currentUrl;
            this.currentUrl = this.router.url;
            window.scrollTo(0, 0);
        });

        // Загружаем акции для дальнейшего вычисления скидки по квартирам
        this.flatsDiscountService.getShares();
    }
}
