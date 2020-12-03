import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, PreloadAllModules } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
/*
 * Platform and Environment providers/directives/pipes
 */
import { environment } from '../environments/environment';
import { ROUTES } from './app.routes';

import { WindowEventsService } from './commons/window-events.observer.service';
import { AuthorizationObserverService } from './authorization/authorization.observer.service';
import { FavoritesService } from './favorites/favorites.service';
import { PlatformDetectService } from './platform-detect.service';
import { FlatsDiscountService } from './commons/flats-discount.service';
import { SearchFlatsLinkHandlerService } from './commons/searchFlatsLinkHandler.service';
import { PhoneObserverService } from './admin-contacts/phone.observer.service';
import { MetaService } from './commons/meta.service';
import { MetaTagsRenderService } from './seo/meta-tags-render.service';

// App is our top level component
import { AppComponent } from './app.component';
import { VideoModalService } from './modal/video-modal/video-modal.service';
import { VideoModalComponent } from './modal/video-modal/video-modal.component';
import { ImgModalService } from './modal/img-modal/img-modal.service';
import { ImgModalComponent } from './modal/img-modal/img-modal.component';
import { OverlayService } from './modal/overlay.service';
import { OverlayComponent } from './modal/overlay.component';
import { HomeModule } from './home/home.module';
import { LocationModule } from './location/location.module';
import { FooterModule } from './footer/footer.module';
import { HeaderModule } from './header/header.module';
import { DynamicModule } from './dynamic/dynamic.module';
import { AboutModule } from './about/about.module';
import { PurchaseModule } from './purchase/purchase.module';
import { NewsSharesModule } from './news-shares/news-shares.module';
import { DecorationModule } from './decoration/decoration.module';
import { FlatsModule } from './flats/flats.module';
import { FavoritesModule } from './favorites/favorites.module';
import { ParkingModule } from './parking/parking.module';
import { SeoModule } from './seo/seo.module';
import { StoreroomsModule } from './storerooms/storerooms.module';
import { AdminContactsModule } from './admin-contacts/admin-contacts.module';
import { DocumentationModule } from './documentation/documentation.module';
import { QuarantineInfoModule } from './quarantine-info/quarantine-info.module';
import { RedPopupComponent } from './3red-popup/3red-popup.component';

// import { ErrorPageModule } from './error-page/error-page.module';
import { AuthorizationModule } from './authorization/authorization.module';
import { APP_RESOLVER_PROVIDERS } from './app.resolver';
import { AppState, InternalStateType } from './app.service';

import '../styles/styles.scss';
import { AgreementModule } from './agreement/agreement.module';

// Application wide providers
const APP_PROVIDERS = [
    ...APP_RESOLVER_PROVIDERS,
    AppState,
    VideoModalService,
    ImgModalService,
    OverlayService,
    WindowEventsService,
    AuthorizationObserverService,
    PlatformDetectService,
    FlatsDiscountService,
    SearchFlatsLinkHandlerService,
    PhoneObserverService,
    MetaService,
    MetaTagsRenderService,
    FavoritesService,
];

const APP_MODULES = [
  //  ErrorPageModule,
    AuthorizationModule,
    HomeModule,
    LocationModule,
    FooterModule,
    HeaderModule,
    DynamicModule,
    AboutModule,
    PurchaseModule,
    NewsSharesModule,
    DecorationModule,
    FlatsModule,
    FavoritesModule,
    ParkingModule,
    StoreroomsModule,
    AdminContactsModule,
    DocumentationModule,
    QuarantineInfoModule,
    SeoModule,
    AgreementModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(ROUTES, {
        // useHash: Boolean(history.pushState) === false,
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
      VideoModalComponent,
      ImgModalComponent,
      OverlayComponent,
      RedPopupComponent
  ],
  imports: [
    ...APP_MODULES
  ],
  providers: [
    ...APP_PROVIDERS
  ]
})
export class AppModule {}
