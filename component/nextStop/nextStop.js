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