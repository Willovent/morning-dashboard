export class DashboardV2Page {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('dashboard-v2-app h1')).getText();
  }
}
