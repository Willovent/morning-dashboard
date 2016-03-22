var configWeather = {
    weatherApiKey: 'f0d716b60dc56bf332a979358f824bec',
    weatherApiUrl: 'http://api.openweathermap.org/data/2.5/weather'
}

angular.module('dashboard')
    .component('weather', {
        retrict: 'E',
        bindings: {
            city: '@'
        },
        templateUrl: './template/weather.html',
        controller: ['$http', function($http) {
            var that = this;
            that.isLoading = true;
            $http.get(configWeather.weatherApiUrl, {
                params: {
                    q: that.city,
                    appid: configWeather.weatherApiKey,
                    'temperature.unit': 'Celsius'
                }
            }).success(function(data) {
                that.temp = (data.main.temp - 273.15).toFixed(2);
                that.icon = data.weather[0].icon.substr(0, 2);
                that.city = data.name;
                that.isLoading = false;

            });
        }]
    });

angular.module('dashboard').
    filter('weatherToClass', function() {
        return function(input) {
            switch (input) {
                case '11': return 'icon-thunder';
                case '09': return 'icon-drizzle';
                case '10': return 'icon-drizzle icon-sunny';
                case '09': return 'icon-showers';
                case '13': return 'icon-snowy';
                case '50': return 'icon-mist';
                case '01': return 'icon-sun';
                case '02': return 'icon-cloud';
                case '04': return 'icon-cloud';
                case '03': return 'icon-cloud';
                default:
                    return '';
            }
        };
    });