import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environment'
import {IMeeting} from '../meeting';

@Injectable()
export class MeetingsService {
    token: string;
    refreshToken: string;
    code: string;

    constructor(private http: Http) {
        this.refreshToken = localStorage['refreshToken'];
        let fromUrl = this.getParameterByName('code');
        if (!fromUrl && !this.refreshToken) {
            this.getCode();
        } else {
            this.code = fromUrl;
        }
    }

    getCode = () =>
        location.href = `${environment.meetingsConfig.endpointOauth}?response_type=code&client_id=${environment.meetingsConfig.clientId}&redirect_uri=${encodeURIComponent(location.origin)}&scope=${encodeURIComponent(environment.meetingsConfig.scope)}`;


    getParameterByName(name): string {
        let url = window.location.href;
        var regex = new RegExp("[?&#]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    getMeetings(): Observable<IMeeting[]> {
        if (this.token) {
            var today = new Date();
            today.setHours(0, 0, 0, 0);
            var tonight = new Date(today.toString());
            tonight.setDate(tonight.getDate() + 1);
            var headers = new Headers();
            headers.set('Authorization', `Bearer ${this.token}`);
            return this.http.get(`${environment.meetingsConfig.calendarView}?startDateTime=${today.toISOString()}&endDateTime=${tonight.toISOString()}&$select=IsAllDay,Start,End,Subject,Location&$orderby=Start/DateTime`, {
                headers
            }).map((response) => {
                let data = response.json();
                var meetings = data.value.map((meeting) =>
                    <IMeeting>{
                        //+'Z' for timezone issue on linux iceweasel
                        from: new Date(meeting.Start.DateTime + 'Z'),
                        to: new Date(meeting.End.DateTime + 'Z'),
                        description: meeting.Subject,
                        location: meeting.Location.DisplayName,
                        isAllDay: meeting.IsAllDay
                    }
                );
                meetings = meetings.filter((meeting) => !(meeting.isAllDay && meeting.from < today));
                return meetings;
            }, (error) => {
                this.token = "";
                this.getMeetings();
            });
        } else {
            let headers = new Headers();
            headers.set("Content-Type", "application/json");
            return Observable.create(observer => {
                this.http.post('http://microsoftoauthproxy.azurewebsites.net/api/token', JSON.stringify({
                    clientId: environment.meetingsConfig.clientId,
                    clientSecret: environment.meetingsConfig.clientSecret,
                    code: this.code,
                    refreshToken: this.refreshToken || '',
                    redirectUri: location.origin
                }), { headers })
                    .subscribe((res) => {
                        let result = res.json();
                        this.token = result.access_token;
                        this.refreshToken = result.refresh_token;
                        localStorage['refreshToken'] = this.refreshToken;
                        setTimeout(() => this.token = "", 3599 * 1000);
                        this.getMeetings().subscribe(meetings => observer.next(meetings));                        
                    }, (error) => {
                        if (error.status == 400) {
                            this.getCode();
                        }
                    });
            });
        }
    }
}