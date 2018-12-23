import { Injectable } from '@angular/core'

import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable()
export class WeatherService {

  constructor(private http: HttpClient) { };

  getMeteo = (city: string): Observable<{ tempMax: number, tempMin: number, icon: string, city: string }> => {
    const params = new HttpParams()
      .append('q', city)
      .append('appid', environment.configWeather.weatherApiKey)
      .append('units', 'metric');

    return this.http.get<any>(`${environment.configWeather.weatherApiUrl}weather`, {
      params
    }).pipe(map((response) => {
      const data = response;
      return {
        tempMax: parseFloat(parseFloat(data.main.temp_max).toFixed(1)),
        tempMin: parseFloat(parseFloat(data.main.temp_min).toFixed(1)),
        icon: data.weather[0].icon.substr(0, 2),
        city: data.name
      }
    }));
  }

  getForcast(city: string): Observable<ForeCast> {
    const params = new HttpParams()
      .append('q', city)
      .append('appid', environment.configWeather.weatherApiKey)
      .append('units', 'metric')
      .append('cnt', '8');
    return this.http.get<any>(`${environment.configWeather.weatherApiUrl}forecast`, {
      params
    }).pipe(map((response) => {
      const data = response;
      const forecast = new ForeCast();
      forecast.city = data.city.name;
      forecast.weathers = data.list.map(weather => {
        return {
          temp: weather.main.temp,
          icon: weather.weather[0].icon.substr(0, 2),
          wind: weather.wind.speed,
          rain: weather.rain ? weather.rain['3h'] : 0,
          snow: weather.snow ? weather.snow['3h'] : 0,
          date: new Date(weather.dt_txt)
        }
      })
      return forecast
    }));
  }
}


export class Weather {
  temp: number;
  icon: string;
  wind?: number;
  rain?: number;
  snow?: number;
  date: Date;
}

export class ForeCast {
  weathers: Weather[];
  city: string;
}
