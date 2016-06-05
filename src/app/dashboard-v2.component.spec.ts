import {
  beforeEachProviders,
  describe,
  expect,
  it,
  inject
} from '@angular/core/testing';
import { DashboardV2AppComponent } from '../app/dashboard-v2.component';

beforeEachProviders(() => [DashboardV2AppComponent]);

describe('App: DashboardV2', () => {
  it('should create the app',
      inject([DashboardV2AppComponent], (app: DashboardV2AppComponent) => {
    expect(app).toBeTruthy();
  }));

  it('should have as title \'dashboard-v2 works!\'',
      inject([DashboardV2AppComponent], (app: DashboardV2AppComponent) => {
    expect(app.title).toEqual('dashboard-v2 works!');
  }));
});
