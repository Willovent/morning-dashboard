import { MorningDashboardV2Page } from './app.po';

describe('morning-dashboard-v2 App', () => {
  let page: MorningDashboardV2Page;

  beforeEach(() => {
    page = new MorningDashboardV2Page();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
