import { Component, Input, OnInit } from '@angular/core';
import { WeatherToClass } from './pipes/weather.weather-to-class';
import { WeatherToCloudBase } from './pipes/weather.weather-to-cloud-base';
import { Http, URLSearchParams } from '@angular/http';


let configWeather = {
  weatherApiKey: "f0d716b60dc56bf332a979358f824bec",
  weatherApiUrl: "http://api.openweathermap.org/data/2.5/weather"
};

@Component({
  moduleId: module.id,
  selector: 'weather',
  templateUrl: 'weather.html',
  styleUrls: ['weather.css'],
  pipes: [WeatherToClass, WeatherToCloudBase]
})
export class Weather implements OnInit {
  isLoad: boolean;
  @Input() city: string;
  tempMax: number;
  tempMin: number;
  icon: string;

  constructor(private http: Http) {
  };

  ngOnInit() {
    this.getMeteo();
    window.setInterval(this.getMeteo, 1000 * 60);
  }
   getMeteo = () => {
    let params = new URLSearchParams();
    params.set("q", this.city);
    params.set("appid", configWeather.weatherApiKey);
    params.set("units", "metric");
    
    this.http.get(configWeather.weatherApiUrl, {
      search: params
    }).subscribe((response) => {
      let data = response.json();
      this.tempMax = parseFloat(parseFloat(data.main.temp_max).toFixed(1));
      this.tempMin = parseFloat(parseFloat(data.main.temp_min).toFixed(1));
      this.icon = data.weather[0].icon.substr(0, 2);
      this.city = data.name;
      this.isLoad = true;
    });

  }
}