module Dashboard {

    let configWeather = {
        weatherApiKey: "f0d716b60dc56bf332a979358f824bec",
        weatherApiUrl: "http://api.openweathermap.org/data/2.5/weather"
    };

    class WeatherController {
        isLoad: boolean;
        city: string;
        temp: number;
        icon: string;

        constructor($http: ng.IHttpService, $interval: ng.IIntervalService) {
            let getMeteo = () => {
                $http.get<any>(configWeather.weatherApiUrl, {
                    params: {
                        q: this.city,
                        appid: configWeather.weatherApiKey,
                        units: "metric"
                    }
                }).success((data) => {
                    this.temp = data.main.temp;
                    this.icon = data.weather[0].icon.substr(0, 2);
                    this.city = data.name;
                    this.isLoad = true;

                }).error(getMeteo);
            };
            getMeteo();
            $interval(getMeteo, 1000 * 60);
        }
    }

    class WeatherComponent implements ng.IComponentOptions {

        bindings: { [binding: string]: string } = {
            city: '@'
        };
        templateUrl = './template/weather.html';
        controller = ['$http', '$interval', WeatherController];

    }

    angular.module("dashboard").component("weather", new WeatherComponent());

    angular.module("dashboard").filter("weatherToClass", function() {
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
    
    angular.module("dashboard").filter("weatherToCloudBase", function() {
        return function(input) {
            switch (input) {
                case '11': return 'basethundercloud';
                case '09': return 'basecloud';
                case '10': return 'basecloud';
                case '09': return 'basecloud';
                case '13': return 'basecloud';
                default:
                    return '';
            }
        };
    });
}