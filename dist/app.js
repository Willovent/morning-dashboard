var Dashboard;
(function (Dashboard) {
    angular.module('dashboard', []);
})(Dashboard || (Dashboard = {}));
var Dashboard;
(function (Dashboard) {
    var meetingsConfig = {
        clientId: 'eeaba47d-44e5-4529-9b5d-c19ec219a220',
        clientSecret: 'Lgyd79HEdCpdhsR89qXaZNh',
        scope: 'https://outlook.office.com/calendars.read',
        endpointOauth: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize'
    };
    console.log();
    var MeetingController = (function () {
        function MeetingController($http, $q, $interval, $timeout) {
            var _this = this;
            this.$http = $http;
            this.$q = $q;
            this.$interval = $interval;
            this.$timeout = $timeout;
            this.refreshToken = localStorage['refreshToken'];
            var fromUrl = this.getParameterByName('code');
            if (!fromUrl && !this.refreshToken) {
                this.getCode();
            }
            else {
                this.code = fromUrl;
            }
            this.getMeetings();
            $interval(function () { return _this.getMeetings(); }, 10 * 1000 * 60);
        }
        MeetingController.prototype.getMeetings = function () {
            var _this = this;
            if (this.token) {
                var today = new Date();
                today.setHours(0, 0, 0, 0);
                var tonight = new Date(today.toString());
                tonight.setDate(tonight.getDate() + 1);
                this.$http.get("https://outlook.office.com/api/v2.0/me/calendarview?startDateTime=" + today.toISOString() + "&endDateTime=" + tonight.toISOString() + "&$select=IsAllDay,Start,End,Subject,Location&$orderby=Start/DateTime", {
                    headers: {
                        Authorization: 'Bearer ' + this.token
                    }
                }).success(function (data) {
                    _this.meetings = data.value.map(function (meeting) {
                        return {
                            from: new Date(meeting.Start.DateTime),
                            to: new Date(meeting.End.DateTime),
                            description: meeting.Subject,
                            location: meeting.Location.DisplayName,
                            isAllDay: meeting.IsAllDay
                        };
                    });
                    _this.isLoad = true;
                }).error(function () {
                    _this.token = "";
                    _this.getMeetings();
                });
            }
            else {
                this.$http.post('http://microsoftoauthproxy.azurewebsites.net/api/token', {
                    clientId: meetingsConfig.clientId,
                    clientSecret: meetingsConfig.clientSecret,
                    code: this.code,
                    refreshToken: this.refreshToken,
                    redirectUri: location.origin
                }).success(function (result) {
                    _this.token = result.access_token;
                    _this.refreshToken = result.refresh_token;
                    localStorage['refreshToken'] = _this.refreshToken;
                    _this.$timeout(3599 * 1000).then(function () { return _this.token = ""; });
                    _this.getMeetings();
                }).catch(function (error) {
                    if (error.statusCode == 400) {
                        _this.getCode();
                    }
                });
            }
        };
        MeetingController.prototype.getCode = function () {
            location.href = meetingsConfig.endpointOauth + "?response_type=code&client_id=" + meetingsConfig.clientId + "&redirect_uri=" + encodeURIComponent(location.origin) + "&scope=" + encodeURIComponent(meetingsConfig.scope) + " offline_access";
        };
        MeetingController.prototype.getParameterByName = function (name) {
            var url = window.location.href;
            var regex = new RegExp("[?&#]" + name + "(=([^&#]*)|&|#|$)"), results = regex.exec(url);
            if (!results)
                return null;
            if (!results[2])
                return '';
            return decodeURIComponent(results[2].replace(/\+/g, " "));
        };
        return MeetingController;
    }());
    var MeetingComponent = (function () {
        function MeetingComponent() {
            this.bindings = {};
            this.templateUrl = './template/meetings.html';
            this.controller = ['$http', '$q', '$interval', '$timeout', MeetingController];
        }
        return MeetingComponent;
    }());
    angular.module('dashboard').component('meetings', new MeetingComponent());
    angular.module('dashboard').filter('toHours', function () { return function (input) {
        var toReadableTime = function (time) { return ("0" + time).slice(-2); };
        input.getHours();
        return toReadableTime(input.getHours()) + ":" + toReadableTime(input.getMinutes());
    }; });
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
                return "Prochain d\u00E9part dans " + minutes + " minutes";
            }
            else if (input === "A l'approche" || input === '0 mn') {
                return "\u00C0 l'approche !";
            }
            else if (input === "A l'arret") {
                return "\u00C0 l'arr\u00EAt !";
            }
            else if (input === 'PERTURBATIONS') {
                return "Perturbations";
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
            $interval(updateTime, 10000);
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
        // let secondes = toReadableTime(input.getSeconds());
        return hours + ":" + minutes;
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
                }).error(getMeteo);
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
    angular.module("dashboard").filter("weatherToCloudBase", function () {
        return function (input) {
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
})(Dashboard || (Dashboard = {}));
