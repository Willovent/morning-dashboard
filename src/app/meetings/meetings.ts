import { Component, Pipe, PipeTransform } from '@angular/core';
import { Http, Headers } from '@angular/http';

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

@Pipe({ name: 'toHours' })
export class ToHours implements PipeTransform {
  transform(input: Date): string {
    if (!input) return "";
    let toReadableTime = (time: number) => ("0" + time).slice(-2);
    return `${toReadableTime(input.getHours())}:${toReadableTime(input.getMinutes())}`;
  }
}

@Component({
  moduleId: module.id,
  selector: 'meetings',
  templateUrl: 'meetings.html',
  styleUrls: ['meetings.css'],
  pipes: [ToHours]
})
export class Meetings {
  token: string;
  refreshToken: string;
  code: string;
  meetings: IMeeting[] = [];
  isLoad: boolean;

  constructor(private http: Http) {
    this.refreshToken = localStorage['refreshToken'];
    let fromUrl = this.getParameterByName('code');
    if (!fromUrl && !this.refreshToken) {
      this.getCode();
    } else {
      this.code = fromUrl;
    }
    this.getMeetings();
    setInterval(() => this.getMeetings(), 10 * 1000 * 60);
  }

  getCode = () =>
    location.href = `${meetingsConfig.endpointOauth}?response_type=code&client_id=${meetingsConfig.clientId}&redirect_uri=${encodeURIComponent(location.origin)}&scope=${encodeURIComponent(meetingsConfig.scope)} offline_access`;


  getParameterByName(name): string {
    let url = window.location.href;
    var regex = new RegExp("[?&#]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  getMeetings() {
    if (this.token) {
      var today = new Date();
      today.setHours(0, 0, 0, 0);
      var tonight = new Date(today.toString());
      tonight.setDate(tonight.getDate() + 1);
      var headers = new Headers();
      headers.set('Authorization', `Bearer ${this.token}`);
      this.http.get(`https://outlook.office.com/api/v2.0/me/calendarview?startDateTime=${today.toISOString()}&endDateTime=${tonight.toISOString()}&$select=IsAllDay,Start,End,Subject,Location&$orderby=Start/DateTime`, {
        headers
      }).subscribe((response) => {
        let data = response.json();
        this.meetings = data.value.map((meeting) =>
          <IMeeting>{
            //+'Z' for timezone issue on linux iceweasel
            from: new Date(meeting.Start.DateTime + 'Z'),
            to: new Date(meeting.End.DateTime + 'Z'),
            description: meeting.Subject,
            location: meeting.Location.DisplayName,
            isAllDay: meeting.IsAllDay
          }
        );
        this.meetings = this.meetings.filter((meeting) => !(meeting.isAllDay && meeting.from < today));
        this.isLoad = true;
      }, (error) => {
        this.token = "";
        this.getMeetings();
      });
    } else {
      let headers = new Headers();
      headers.set("Content-Type", "application/json")
      this.http.post('http://microsoftoauthproxy.azurewebsites.net/api/token', JSON.stringify({
        clientId: meetingsConfig.clientId,
        clientSecret: meetingsConfig.clientSecret,
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
          this.getMeetings();
        }, (error) => {
          if (error.statusCode == 400) {
            this.getCode();
          }
        })
    }
  }
}