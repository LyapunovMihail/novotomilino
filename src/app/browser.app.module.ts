// Native
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// Modules
import { AppModule } from './app.module';

// Components
import { AppComponent } from './app.component';

@NgModule({
    imports: [
        AppModule,
        BrowserModule.withServerTransition({ appId: 'ssr-novotomilino' }),
    ],
    bootstrap: [AppComponent]
})
export class BrowserAppModule {}
