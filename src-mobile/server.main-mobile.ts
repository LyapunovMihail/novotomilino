import { enableProdMode } from '@angular/core';
export { ServerAppModule } from './mobile-app/server.app.module';
export { renderModule, renderModuleFactory } from '@angular/platform-server';
import 'zone.js';

enableProdMode();
