import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment'
import { HttpClient } from '@angular/common/http';

@Injectable()
export class NextStopService {
  constructor(private http: HttpClient) { }

  private apiPattern = (type: string, ligne: string, station: string, direction: string) => {
    const formattedType = type.toLowerCase();
    const formattedStation = station.toLowerCase().replace(/\s/g, '+');
    return `${environment.ratpBaseUrl}schedules/${formattedType}/${ligne}/${formattedStation}/${direction}`;
  }

  updateHoraire = (type: string, ligne: string, station: string, direction: string)
    : Observable<{ type: any, ligne: any, station: any, times: any[] }> => {
    return this.http.get<any>(this.apiPattern(type, ligne, station, direction))
      .map(res => {
        const data = res;
        const times = [];
        for (const schedule of data.result.schedules) {
          times.push(schedule.message);
        }
        return {
          type: type,
          station: station,
          ligne: ligne,
          times
        }
      });
  };

}
