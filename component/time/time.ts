module Dashboard {

    class TimeController {
        now: Date;
        constructor($interval) {
            var updateTime = () => {
                this.now = new Date();
            };
            updateTime();
            $interval(updateTime, 10000);
        }
    }

    class TimeComponent implements ng.IComponentOptions {
        templateUrl = 'template/time.html';
        restrict = 'E';
        controller = ['$interval', TimeController];
    }

    angular.module('dashboard').filter('readableTime', () => (input: Date) => {
        let toReadableTime = (time: number) => ("0" + time).slice(-2);
        let hours = toReadableTime(input.getHours());
        let minutes = toReadableTime(input.getMinutes());
        // let secondes = toReadableTime(input.getSeconds());
        return `${hours}:${minutes}`;
    });

    angular.module('dashboard').component('time', new TimeComponent());
}