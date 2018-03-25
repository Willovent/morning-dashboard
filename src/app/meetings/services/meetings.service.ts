import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment'
import { IMeeting } from '../meeting';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class MeetingsService {
  token: string;
  refreshToken: string;
  code: string;

  constructor(private http: HttpClient) {
    this.refreshToken = localStorage['refreshToken'];
    const fromUrl = this.getParameterByName('code');
    if (!fromUrl && !this.refreshToken) {
      this.getCode();
    } else {
      this.code = fromUrl;
    }
  }

  private getCode = () =>
    // tslint:disable-next-line:max-line-length
    location.href = `${environment.meetingsConfig.endpointOauth}?response_type=code&client_id=${environment.meetingsConfig.clientId}&redirect_uri=${encodeURIComponent(location.origin)}&scope=${encodeURIComponent(environment.meetingsConfig.scope)}`;


  private getParameterByName(name): string {
    const url = window.location.href;
    const regex = new RegExp('[?&#]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
    if (!results) {
      return null;
    }
    if (!results[2]) {
      return '';
    }
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

  getMeetings(): Observable<IMeeting[]> {
    if (this.token) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tonight = new Date(today.toString());
      tonight.setDate(tonight.getDate() + 1);
      const headers = new HttpHeaders();
      headers.set('Authorization', `Bearer ${this.token}`);
      // tslint:disable-next-line:max-line-length
      return this.http.get<any>(`${environment.meetingsConfig.calendarView}?startDateTime=${today.toISOString()}&endDateTime=${tonight.toISOString()}&$select=IsAllDay,Start,End,Subject,Location&$orderby=Start/DateTime`, {
        headers
      }).map((response) => {
        const data = response;
        let meetings = data.value.map((meeting) =>
          <IMeeting>{
            // +'Z' for timezone issue on linux iceweasel
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
        this.token = '';
        this.getMeetings();
      });
    } else {
      const headers = new HttpHeaders();
      headers.set('Content-Type', 'application/json');
      return Observable.create(observer => {
        this.http.post<any>('http://microsoftoauthproxy.azurewebsites.net/api/token', JSON.stringify({
          clientId: environment.meetingsConfig.clientId,
          clientSecret: environment.meetingsConfig.clientSecret,
          code: this.code,
          refreshToken: this.refreshToken || '',
          redirectUri: location.origin
        }), { headers })
          .subscribe((res) => {
            const result = res;
            this.token = result.access_token;
            this.refreshToken = result.refresh_token;
            localStorage['refreshToken'] = this.refreshToken;
            setTimeout(() => this.token = '', 3599 * 1000);
            this.getMeetings().subscribe(meetings => observer.next(meetings));
          }, (error) => {
            if (error.status === 400) {
              this.getCode();
            }
          });
      });
    }
  }
}
