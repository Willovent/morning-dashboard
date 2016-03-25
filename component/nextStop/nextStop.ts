module Dashboard {

    let configNextStop = {
        apiPattern: function(type, ligne, station, direction) {
            type = type.toLowerCase();
            station = station.toLowerCase().replace(/\s/g, '+');
            direction = direction.toLowerCase().replace(/\s/g, '+');
            return `http://api-ratp.pierre-grimaud.fr/v2/${type}/${ligne}/stations/${station}?destination=${direction}`;
        }
    }

class NextStopComponent implements ng.IComponentOptions{    
    
            bindings = {
                'station': '@',
                'direction': '@',
                'ligne': '@',
                'type': '@'
            };
            templateUrl = './template/nextStop.html';
            controller= ['$http', '$interval', function($http, $interval) {
                var that = this;
                that.isLoading = true;
                var updateHoraire = function() {
                    $http.get(configNextStop.apiPattern(that.type, that.ligne, that.station, that.direction)).success(function(data) {
                        that.type = data.response.informations.type;
                        that.station = data.response.informations.station.name;
                        that.time = []
                        for (var i in data.response.schedules) {
                            that.time.push(data.response.schedules[i].message);
                        }
                        that.ligne = data.response.informations.line;
                        that.isLoad = true;
                    });
                };
                updateHoraire();
                $interval(updateHoraire, 20 * 1000);
            }];
        }
}

    angular.module('dashboard')
        .component('nextStop', );

    angular.module('dashboard').filter('schedulesToText', function() {
        return function(input) {
            var minutes = parseInt(input);
            if (minutes) {
                return `Prochain dans départ dans ${minutes} minutes`;
            } else if (input === `A l'approche` || input === '0 mn') {
                return `À l'approche !`;
            } else if (input === `A l'arret`) {
                return `À l'arrêt !`;
            } else {
                return `Service terminé`;
            }
        }
    })

    angular.module('dashboard').filter('schedulesToclass', function() {
        return function(input) {
            var minutes = parseInt(input);

            if (minutes && minutes < 7) {
                return 'close';
            } else if (!minutes) {
                return 'error';
            } else {
                return '';
            }
        }
    })
}