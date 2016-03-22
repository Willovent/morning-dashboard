angular.module('dashboard',[]);
var configNextStop = {
    apiPattern: function(type, ligne, station, direction) {
        type = type.toLowerCase();
        station = station.toLowerCase().replace(/\s/g, '+');
        direction = direction.toLowerCase().replace(/\s/g, '+');
        return `http://api-ratp.pierre-grimaud.fr/v2/${type}/${ligne}/stations/${station}?destination=${direction}`;
    }
}

angular.module('dashboard')
    .component('nextStop', {
        bindings: {
            station: '@',
            direction: '@',
            ligne: '@',
            type: '@'
        },
        templateUrl:'./template/nextStop.html',
        controller: ['$http', function($http) {
            var that = this;
            that.isLoading = true;
            $http.get(configNextStop.apiPattern(that.type, that.ligne, that.station, that.direction)).success(function(data) {
                that.type = data.response.informations.type;
                that.station = data.response.informations.station.name;
                that.time = []
                for (var i in data.response.schedules) {
                    that.time.push(data.response.schedules[i].message);
                }
                that.ligne = data.response.informations.line;
            });
        }],
    });
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
        controller: ['$http','$interval', function($http,$interval) {
            var that = this;
            that.isLoad = true;
            let getMeteo = () => {
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
                    that.isLoad = false;

                });
            };
            getMeteo();
            $interval(() => getMeteo(),5000);
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