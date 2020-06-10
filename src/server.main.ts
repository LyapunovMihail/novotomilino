import { enableProdMode } from '@angular/core';
export { ServerAppModule } from './app/server.app.module';
import 'zone.js';
export { renderModule, renderModuleFactory } from '@angular/platform-server';
enableProdMode();
