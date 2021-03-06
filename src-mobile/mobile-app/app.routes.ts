import { Routes } from '@angular/router';

export const ROUTES: Routes = [
    { path: '', loadChildren : './home/home.module#HomeModule' },
    { path: 'about', loadChildren: './about/about.module#AboutModule' },
    { path: 'documentation', loadChildren: './documentation/documentation.module#DocumentationModule' },
    { path: 'dynamic/:year/:month', loadChildren: './dynamic/dynamic.module#DynamicModule' },
    { path: 'purchase/**', loadChildren: './purchase/purchase.module#PurchaseModule' },
    { path: 'quarantine', loadChildren: './quarantine-info/quarantine-info.module#QuarantineInfoModule' },
    { path: 'news-shares/**', loadChildren : './news-shares/news-shares.module#NewsSharesModule' },
    { path: 'decoration/**', loadChildren: './decoration/decoration.module#DecorationModule' },
    { path: 'location/**', loadChildren: './location/location.module#LocationModule' },
    { path: 'flats/**', loadChildren : './flats/flats.module#FlatsModule' },
    { path: 'favorites', loadChildren: './favorites/favorites.module#FavoritesModule' },
    { path: 'agreement', loadChildren: './agreement/agreement.module#AgreementModule' },

    { path: 'error-404', loadChildren: './error-page/error-page.module#ErrorPageModule' },
    { path: '**', loadChildren: './error-page/error-page.module#ErrorPageModule' }
];
