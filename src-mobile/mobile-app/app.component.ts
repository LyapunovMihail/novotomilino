import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AppState } from './app.service';

export const ROOT_SELECTOR = 'app-root';
declare let $: any;

@Component({
    selector: ROOT_SELECTOR,
    encapsulation: ViewEncapsulation.None,
    styleUrls: [
        './app.component.css'
    ],
    template: `
        <!-- <app-authorization></app-authorization> -->

        <section>

            <app-header></app-header>

            <router-outlet></router-outlet>

            <app-footer></app-footer>

        </section>

        <app-overlay></app-overlay>
        <app-img-modal></app-img-modal>
        <app-video-modal></app-video-modal>
    `
})
export class AppComponent implements OnInit {

    constructor(
        public appState: AppState
    ) {}

    public ngOnInit() {
        console.log('Initial App State', this.appState.state);
    }
}

/**
 * Please review the https://github.com/AngularClass/angular-examples/ repo for
 * more angular app examples that you may copy/paste
 * (The examples may not be updated as quickly. Please open an issue on github for us to update it)
 * For help or questions please contact us at @AngularClass on twitter
 * or our chat on Slack at https://AngularClass.com/slack-join
 */
