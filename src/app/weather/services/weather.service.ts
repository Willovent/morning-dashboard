import { Injectable } from '@angular/core'
import { Http, URLSearchParams } from '@angular/http';

@Injectable()
export class WeatherService {

    constructor(private http: Http) {
    };

    getMeteo = () => {
    let params = new URLSearchParams();
    params.set("q", this.city);
    params.set("appid", configWeather.weatherApiKey);
    params.set("units", "metric");
    
    this.http.get(configWeather.weatherApiUrl, {
      search: params
    })
    .subscribe((response) => {
      let data = response.json();
      this.tempMax = parseFloat(parseFloat(data.main.temp_max).toFixed(1));
      this.tempMin = parseFloat(parseFloat(data.main.temp_min).toFixed(1));
      this.icon = data.weather[0].icon.substr(0, 2);
      this.city = data.name;
      this.isLoad = true;
    });
  }
}