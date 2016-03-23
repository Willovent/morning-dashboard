angular.module('dashboard').component('time', {
    templateUrl : 'template/time.html',
    restrict: 'E',
    controller : ['$interval',function($interval){
        var that = this;
        var updateTime = () => {
            now = new Date();
            that.hours = toReadableTime(now.getHours());
            that.minutes = toReadableTime(now.getMinutes());
            that.secondes = toReadableTime(now.getSeconds())
        };
        var toReadableTime = (input) => {
            return ("0" + input).slice(-2);
        }
        updateTime();
        $interval(updateTime,1000);
    }],
});