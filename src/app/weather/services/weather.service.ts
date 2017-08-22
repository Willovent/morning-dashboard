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

    return this.http.get(`${environment.configWeather.weatherApiUrl}/weather`, {
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

  getForcast(city: string): Observable<ForeCast> {
    const params = new URLSearchParams();
    params.set('q', city);
    params.set('appid', environment.configWeather.weatherApiKey);
    params.set('units', 'metric');
    params.set('cnt', '8');
    return this.http.get(`${environment.configWeather.weatherApiUrl}/forecast`, {
      search: params
    }).map((response) => {
      const data = response.json();
      const forecast = new ForeCast();
      forecast.city = data.city.name;
      console.log(data);

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
    });
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
