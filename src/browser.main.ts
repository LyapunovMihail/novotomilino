import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { BrowserAppModule } from './app/browser.app.module';
import { environment } from './environments/environment';
import 'zone.js';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(BrowserAppModule)
  .catch(err => console.error(err));
