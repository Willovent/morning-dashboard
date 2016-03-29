module Dashboard {

    let configNextStop = {
        apiPattern: function(type, ligne, station, direction) {
            type = type.toLowerCase();
            station = station.toLowerCase().replace(/\s/g, '+');
            direction = direction.toLowerCase().replace(/\s/g, '+');
            return `http://api-ratp.pierre-grimaud.fr/v2/${type}/${ligne}/stations/${station}?destination=${direction}`;
        }
    }
    class NextStopController {
        isLoad: boolean;
        type: string;
        ligne: string;
        station: string;
        direction: string;
        time: string[];

        constructor($http: ng.IHttpService, $interval: ng.IIntervalService) {
            let updateHoraire = () => {
                $http.get<any>(configNextStop.apiPattern(this.type, this.ligne, this.station, this.direction)).success((data) => {
                    this.type = data.response.informations.type;
                    this.station = data.response.informations.station.name;
                    this.time = []
                    for (let schedule of data.response.schedules) {
                        this.time.push(schedule.message);
                    }
                    this.ligne = data.response.informations.line;
                    this.isLoad = true;
                });
            };
            updateHoraire();
            $interval(updateHoraire, 20 * 1000);
        }
    }

    class NextStopComponent implements ng.IComponentOptions {
        bindings: { [binding: string]: string } = {
            station: '@',
            direction: '@',
            ligne: '@',
            type: '@'
        };
        templateUrl = './template/nextStop.html';
        controller = ['$http', '$interval', NextStopController];
    }

    angular.module('dashboard').component('nextStop', new NextStopComponent());

    angular.module('dashboard').filter('schedulesToText', function() {
        return function(input) {
            var minutes = parseInt(input);
            if (minutes) {
                return `Prochain départ dans ${minutes} minutes`;
            } else if (input === `A l'approche` || input === '0 mn') {
                return `À l'approche !`;
            } else if (input === `A l'arret`) {
                return `À l'arrêt !`;
            } else if (input === 'PERTURBATIONS') {
                return `Perturbations`;
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
    });
}