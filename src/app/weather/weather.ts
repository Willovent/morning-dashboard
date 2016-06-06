import { Component, Input, OnInit } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { WeatherToClass } from './weather.weather-to-class.pipe';
import { WeatherToCloudBase } from './weather.weather-to-cloud-base.pipe';

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
      this.tempMax = data.main.temp_max;
      this.tempMin = data.main.temp_min;
      this.icon = data.weather[0].icon.substr(0, 2);
      this.city = data.name;
      this.isLoad = true;
    });

  }
}