import { Component, Input, OnInit } from '@angular/core';
import { WeatherToClass } from './pipes/weather.weather-to-class';
import { WeatherToCloudBase } from './pipes/weather.weather-to-cloud-base';
import { Http, URLSearchParams } from '@angular/http';
import { WeatherService } from './services/weather.service'


@Component({
  moduleId: module.id,
  selector: 'weather',
  templateUrl: 'weather.html',
  styleUrls: ['weather.css'],
  pipes: [WeatherToClass, WeatherToCloudBase],
  providers : [WeatherService]
})
export class Weather implements OnInit {
  isLoad: boolean;
  @Input() city: string;
  tempMax: number;
  tempMin: number;
  icon: string;

  constructor(private weatherService: WeatherService) { };

  ngOnInit() {
    this.getMeteo();
    window.setInterval(this.getMeteo, 1000 * 60);
  }

   getMeteo = () => {    
    this.weatherService.getMeteo(this.city).subscribe((data) => {
      this.tempMax = data.tempMax;
      this.tempMin = data.tempMin;
      this.icon = data.icon
      this.city = data.city;
      this.isLoad = true;
    });
  }
}