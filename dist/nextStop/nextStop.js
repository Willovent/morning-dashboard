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
