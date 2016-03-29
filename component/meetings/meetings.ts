module Dashboard {
    let meetingsConfig = {
        clientId: 'eeaba47d-44e5-4529-9b5d-c19ec219a220',
        clientSecret: 'Lgyd79HEdCpdhsR89qXaZNh',
        scope: 'https://outlook.office.com/calendars.read',
        endpointOauth: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    }
    
    export interface IMeeting {
        from: Date;
        to: Date;
        location: string;
        description: string;
        isAllDay: boolean;
    }

    class MeetingController {
        token: string;
        refreshToken: string;
        code: string;
        meetings: IMeeting[];
        isLoad: boolean;

        constructor(private $http: ng.IHttpService, private $q: ng.IQService, private $interval: ng.IIntervalService, private $timeout: ng.ITimeoutService) {
            this.refreshToken = localStorage['refreshToken'];
            let fromUrl = this.getParameterByName('code');
            if (!fromUrl && !this.refreshToken) {
                this.getCode();
            } else {
                this.code = fromUrl;
            }
            this.getMeetings();
            $interval(() => this.getMeetings(), 10 * 1000 * 60);
        }

        getMeetings() {
            if (this.token) {
                var today = new Date();
                today.setHours(0, 0, 0, 0);
                var tonight = new Date(today.toString());
                tonight.setDate(tonight.getDate() + 1);
                this.$http.get<any>(`https://outlook.office.com/api/v2.0/me/calendarview?startDateTime=${today.toISOString()}&endDateTime=${tonight.toISOString()}&$select=IsAllDay,Start,End,Subject,Location&$orderby=Start/DateTime`, {
                    headers: {
                        Authorization: 'Bearer ' + this.token
                    }
                }).success((data) => {
                    this.meetings = data.value.map((meeting) =>
                        <IMeeting>{
                            from: new Date(meeting.Start.DateTime),
                            to: new Date(meeting.End.DateTime),
                            description: meeting.Subject,
                            location: meeting.Location.DisplayName,
                            isAllDay: meeting.IsAllDay
                        }
                    );
                    this.meetings = this.meetings.filter((meeting) => !(meeting.isAllDay && meeting.from < today));
                    this.isLoad = true;
                }).error(() => {
                    this.token = "";
                    this.getMeetings();
                });
            } else {
                this.$http.post<any>('http://microsoftoauthproxy.azurewebsites.net/api/token', {
                    clientId: meetingsConfig.clientId,
                    clientSecret: meetingsConfig.clientSecret,
                    code: this.code,
                    refreshToken: this.refreshToken,
                    redirectUri: location.origin
                }).success((result) => {
                    this.token = result.access_token;
                    this.refreshToken = result.refresh_token;
                    localStorage['refreshToken'] = this.refreshToken;
                    this.$timeout(3599 * 1000).then(() => this.token = "");
                    this.getMeetings();
                }).catch((error) => {
                    if (error.statusCode == 400) {
                        this.getCode();
                    }
                });
            }
        }

        getCode() {
            location.href = `${meetingsConfig.endpointOauth}?response_type=code&client_id=${meetingsConfig.clientId}&redirect_uri=${encodeURIComponent(location.origin)}&scope=${encodeURIComponent(meetingsConfig.scope)} offline_access`;
        }

        getParameterByName(name): string {
            let url = window.location.href;
            var regex = new RegExp("[?&#]" + name + "(=([^&#]*)|&|#|$)"),
                results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\+/g, " "));
        }
    }

    class MeetingComponent implements ng.IComponentOptions {
        bindings: { [binding: string]: string } = {};
        templateUrl = './template/meetings.html';
        controller = ['$http', '$q', '$interval', '$timeout', MeetingController];
    }

    angular.module('dashboard').component('meetings', new MeetingComponent());

    angular.module('dashboard').filter('toHours', () => (input: Date) => {
        let toReadableTime = (time: number) => ("0" + time).slice(-2);
        return `${toReadableTime(input.getHours())}:${toReadableTime(input.getMinutes())}`;
    })
}