import { DashboardV2Page } from './app.po';

describe('dashboard-v2 App', function() {
  let page: DashboardV2Page;

  beforeEach(() => {
    page = new DashboardV2Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('dashboard-v2 works!');
  });
});
