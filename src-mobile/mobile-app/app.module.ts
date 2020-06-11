import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, PreloadAllModules } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
/*
 * Platform and Environment providers/directives/pipes
 */
import { ROUTES } from './app.routes';
import { MetaTagsRenderService } from './commons/meta-tags-render.service';

import { WindowEventsService } from './commons/window-events.observer.service';
import { FavoritesService } from './commons/favorites.service';
import { PlatformDetectService } from './platform-detect.service';
import { FlatsDiscountService } from './commons/flats-discount.service';
// App is our top level component
import { AppComponent } from './app.component';
import { ImgModalService } from './modal/img-modal/img-modal.service';
import { ImgModalComponent } from './modal/img-modal/img-modal.component';
import { OverlayService } from './modal/overlay.service';
import { OverlayComponent } from './modal/overlay.component';
import { HomeModule } from './home/home.module';
import { FooterModule } from './footer/footer.module';
import { HeaderModule } from './header/header.module';
import { AboutModule } from './about/about.module';
import { PurchaseModule } from './purchase/purchase.module';
import { FavoritesModule } from './favorites/favorites.module';
import { FlatsModule } from './flats/flats.module';
import { NewsSharesModule } from './news-shares/news-shares.module';
import { DecorationModule } from './decoration/decoration.module';
import { LocationModule } from './location/location.module';
import { DocumentationModule } from './documentation/documentation.module';

// import { ErrorPageModule } from './error-page/error-page.module';
import { APP_RESOLVER_PROVIDERS } from './app.resolver';
import { AppState, InternalStateType } from './app.service';
import { DynamicModule } from './dynamic/dynamic.module';

import '../styles/styles.scss';
import { QuarantineInfoModule } from './quarantine-info/quarantine-info.module';
import { RedPopupComponent } from './3red-popup/3red-popup.component';


// Application wide providers
const APP_PROVIDERS = [
    ...APP_RESOLVER_PROVIDERS,
    AppState,
    ImgModalService,
    OverlayService,
    WindowEventsService,
    FavoritesService,
    PlatformDetectService,
    FlatsDiscountService,
    MetaTagsRenderService
];

const APP_MODULES = [
    //  ErrorPageModule,
    HomeModule,
    LocationModule,
    FooterModule,
    DynamicModule,
    HeaderModule,
    AboutModule,
    PurchaseModule,
    NewsSharesModule,
    FavoritesModule,
    FlatsModule,
    DecorationModule,
    DocumentationModule,
    QuarantineInfoModule,

    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(ROUTES, {
        useHash: Boolean(history.pushState) === false,
        preloadingStrategy: PreloadAllModules
    })
];

interface StoreType {
    state: InternalStateType;
    restoreInputValues: () => void;
    disposeOldHosts: () => void;
}

@NgModule({
    // bootstrap: [ AppComponent ],
    declarations: [
        AppComponent,
        ImgModalComponent,
        OverlayComponent,
        RedPopupComponent,
    ],
    imports: [
        ...APP_MODULES
    ],
    providers: [
        ...APP_PROVIDERS
    ]
})
export class AppModule {}
