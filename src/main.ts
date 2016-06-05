import { bootstrap } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { DashboardV2AppComponent, environment } from './app/';

if (environment.production) {
  enableProdMode();
}

bootstrap(DashboardV2AppComponent);

