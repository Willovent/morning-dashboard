var Dashboard;
(function (Dashboard) {
    var configWeather = {
        weatherApiKey: "f0d716b60dc56bf332a979358f824bec",
        weatherApiUrl: "http://api.openweathermap.org/data/2.5/weather"
    };
    var WeatherController = (function () {
        function WeatherController($http, $interval) {
            var _this = this;
            var getMeteo = function () {
                $http.get(configWeather.weatherApiUrl, {
                    params: {
                        q: _this.city,
                        appid: configWeather.weatherApiKey,
                        "temperature.unit": "Celsius"
                    }
                }).success(function (data) {
                    this.temp = (data.main.temp - 273.15).toFixed(2);
                    this.icon = data.weather[0].icon.substr(0, 2);
                    this.city = data.name;
                    this.isLoad = true;
                });
            };
            getMeteo();
            $interval(getMeteo, 1000 * 60);
        }
        return WeatherController;
    }());
    var WeatherComponent = (function () {
        function WeatherComponent() {
            this.retrict = 'E';
            this.bindings = {
                city: '@'
            };
            this.templateUrl = './template/weather.html';
            this.controller = ['$http', '$interval', WeatherController];
        }
        return WeatherComponent;
    }());
    angular.module("dashboard").component("weather", WeatherComponent);
    angular.module("dashboard").filter("weatherToClass", function () {
        return function (input) {
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
})(Dashboard || (Dashboard = {}));
