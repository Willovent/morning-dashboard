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
        controller = ['$interval', TimeController];
    }

    angular.module('dashboard').component('time', new TimeComponent());

    angular.module('dashboard').filter('readableTime', () => (input: Date) => {
        let toReadableTime = (time: number) => ("0" + time).slice(-2);
        let hours = toReadableTime(input.getHours());
        let minutes = toReadableTime(input.getMinutes());
        // let secondes = toReadableTime(input.getSeconds());
        return `${hours}:${minutes}`;
    });

    angular.module('dashboard').filter('dayOfWeek', () => (input: Date) => {
        switch (input.getDay()) {
            case 1: return 'lundi';
            case 2: return 'mardi';
            case 3: return 'mercredi';
            case 4: return 'jeudi';
            case 5: return 'vendredi';
            case 6: return 'samedi';
            case 0: return 'dimanche';
        }
    });

    angular.module('dashboard').filter('monthOfYear', () => (input: Date) => {
        switch (input.getMonth()) {
            case 1: return 'janvier';
            case 2: return 'fevrier';
            case 3: return 'mars';
            case 4: return 'avril';
            case 5: return 'mai';
            case 6: return 'juin';
            case 7: return 'juillet';
            case 8: return 'août';
            case 9: return 'septembre';
            case 10: return 'octobre';
            case 11: return 'novembre';
            case 12: return 'décembre';
        }
    });
}