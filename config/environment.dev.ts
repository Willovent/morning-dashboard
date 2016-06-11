export const environment = {
  production: false,
  meetingsConfig: {
    clientId: 'eeaba47d-44e5-4529-9b5d-c19ec219a220',
    clientSecret: 'Lgyd79HEdCpdhsR89qXaZNh',
    scope: 'https://outlook.office.com/calendars.read',
    endpointOauth: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    calendarView: 'https://outlook.office.com/api/v2.0/me/calendarview'
  },
  configWeather: {
    weatherApiKey: "f0d716b60dc56bf332a979358f824bec",
    weatherApiUrl: "http://api.openweathermap.org/data/2.5/weather"
  },
  ratpBaseUrl: 'http://api-ratp.pierre-grimaud.fr/v2/'
};
