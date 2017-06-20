import { Injectable } from '@angular/core'
import { Http, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';

@Injectable()
export class WeatherService {

  constructor(private http: Http) { };

  getMeteo = (city: string): Observable<{ tempMax: number, tempMin: number, icon: string, city: string }> => {
    const params = new URLSearchParams();
    params.set('q', city);
    params.set('appid', environment.configWeather.weatherApiKey);
    params.set('units', 'metric');

    return this.http.get(environment.configWeather.weatherApiUrl, {
      search: params
    }).map((response) => {
      const data = response.json();
      return {
        tempMax: parseFloat(parseFloat(data.main.temp_max).toFixed(1)),
        tempMin: parseFloat(parseFloat(data.main.temp_min).toFixed(1)),
        icon: data.weather[0].icon.substr(0, 2),
        city: data.name
      }
    });
  }
}
