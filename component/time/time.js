angular.module('dashboard').component('time', {
    templateUrl : 'template/time.html',
    restrict: 'E',
    controller : ['$interval',function($interval){
        var that = this;
        var updateTime = function(){
            now = new Date();
            that.hours = now.getHours();
            that.minutes = now.getMinutes();
            that.secondes = ("0" + now.getSeconds()).slice(-2);
        }
        updateTime();
        $interval(updateTime,1000);
    }],
});