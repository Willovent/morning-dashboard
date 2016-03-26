var Dashboard;
(function (Dashboard) {
    angular.module('dashboard', []);
})(Dashboard || (Dashboard = {}));
var Dashboard;
(function (Dashboard) {
    var configNextStop = {
        apiPattern: function (type, ligne, station, direction) {
            type = type.toLowerCase();
            station = station.toLowerCase().replace(/\s/g, '+');
            direction = direction.toLowerCase().replace(/\s/g, '+');
            return "http://api-ratp.pierre-grimaud.fr/v2/" + type + "/" + ligne + "/stations/" + station + "?destination=" + direction;
        }
    };
    var NextStopController = (function () {
        function NextStopController($http, $interval) {
            var _this = this;
            var updateHoraire = function () {
                $http.get(configNextStop.apiPattern(_this.type, _this.ligne, _this.station, _this.direction)).success(function (data) {
                    _this.type = data.response.informations.type;
                    _this.station = data.response.informations.station.name;
                    _this.time = [];
                    for (var _i = 0, _a = data.response.schedules; _i < _a.length; _i++) {
                        var schedule = _a[_i];
                        _this.time.push(schedule.message);
                    }
                    _this.ligne = data.response.informations.line;
                    _this.isLoad = true;
                });
            };
            updateHoraire();
            $interval(updateHoraire, 20 * 1000);
        }
        return NextStopController;
    }());
    var NextStopComponent = (function () {
        function NextStopComponent() {
            this.bindings = {
                station: '@',
                direction: '@',
                ligne: '@',
                type: '@'
            };
            this.templateUrl = './template/nextStop.html';
            this.controller = ['$http', '$interval', NextStopController];
        }
        return NextStopComponent;
    }());
    angular.module('dashboard').component('nextStop', new NextStopComponent());
    angular.module('dashboard').filter('schedulesToText', function () {
        return function (input) {
            var minutes = parseInt(input);
            if (minutes) {
                return "Prochain dans d\u00E9part dans " + minutes + " minutes";
            }
            else if (input === "A l'approche" || input === '0 mn') {
                return "\u00C0 l'approche !";
            }
            else if (input === "A l'arret") {
                return "\u00C0 l'arr\u00EAt !";
            }
            else {
                return "Service termin\u00E9";
            }
        };
    });
    angular.module('dashboard').filter('schedulesToclass', function () {
        return function (input) {
            var minutes = parseInt(input);
            if (minutes && minutes < 7) {
                return 'close';
            }
            else if (!minutes) {
                return 'error';
            }
            else {
                return '';
            }
        };
    });
})(Dashboard || (Dashboard = {}));
var Dashboard;
(function (Dashboard) {
    var TimeController = (function () {
        function TimeController($interval) {
            var _this = this;
            var updateTime = function () {
                _this.now = new Date();
            };
            updateTime();
            $interval(updateTime, 1000);
        }
        return TimeController;
    }());
    var TimeComponent = (function () {
        function TimeComponent() {
            this.templateUrl = 'template/time.html';
            this.restrict = 'E';
            this.controller = ['$interval', TimeController];
        }
        return TimeComponent;
    }());
    angular.module('dashboard').filter('readableTime', function () { return function (input) {
        var toReadableTime = function (time) { return ("0" + time).slice(-2); };
        var hours = toReadableTime(input.getHours());
        var minutes = toReadableTime(input.getMinutes());
        var secondes = toReadableTime(input.getSeconds());
        return hours + ":" + minutes + ":" + secondes;
    }; });
    angular.module('dashboard').component('time', new TimeComponent());
})(Dashboard || (Dashboard = {}));
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
                        units: "metric"
                    }
                }).success(function (data) {
                    _this.temp = data.main.temp;
                    _this.icon = data.weather[0].icon.substr(0, 2);
                    _this.city = data.name;
                    _this.isLoad = true;
                });
            };
            getMeteo();
            $interval(getMeteo, 1000 * 60);
        }
        return WeatherController;
    }());
    var WeatherComponent = (function () {
        function WeatherComponent() {
            this.bindings = {
                city: '@'
            };
            this.templateUrl = './template/weather.html';
            this.controller = ['$http', '$interval', WeatherController];
        }
        return WeatherComponent;
    }());
    angular.module("dashboard").component("weather", new WeatherComponent());
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
