// Native
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server';
import { NgModule } from '@angular/core';
import { ModuleMapLoaderModule } from '@nguniversal/module-map-ngfactory-loader';

// Modules
import { AppModule } from './app.module';

// Components
import { AppComponent } from './app.component';
import { UniversalInterceptor } from './commons/universalInterceptor.service';

@NgModule({
    imports: [
        AppModule,
        BrowserModule.withServerTransition({ appId: 'ssr-novotomilino' }),
        ServerModule,
        ModuleMapLoaderModule,
        ServerTransferStateModule
    ],
    providers: [{
        provide: HTTP_INTERCEPTORS,
        useClass: UniversalInterceptor,
        /* Multi is important or you will delete all the other interceptors */
        multi: true
    }],
    bootstrap: [AppComponent]
})
export class ServerAppModule { }
