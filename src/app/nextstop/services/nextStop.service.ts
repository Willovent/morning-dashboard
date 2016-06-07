import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class NextStopService {
  constructor(private http: Http) { }

  apiPattern = (type: string, ligne: string, station: string, direction: string) => {
    type = type.toLowerCase();
    station = station.toLowerCase().replace(/\s/g, '+');
    direction = direction.toLowerCase().replace(/\s/g, '+');
    return `http://api-ratp.pierre-grimaud.fr/v2/${type}/${ligne}/stations/${station}?destination=${direction}`;
  }

  updateHoraire = (type: string, ligne: string, station: string, direction: string): Observable<{ type: any, ligne: any, station: any, times: any[] }> => {
    return this.http.get(this.apiPattern(type, ligne, station, direction))
      .map(res => {
        let data = res.json();
        var times = [];
        for (let schedule of data.response.schedules) {
          times.push(schedule.message);
        }
        return {
          type: data.response.informations.type,
          station: data.response.informations.station.name,
          ligne: data.response.informations.line,
          times
        }
      });
  };

}
