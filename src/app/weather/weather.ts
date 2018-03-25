import { Component, Input, OnInit } from '@angular/core';
import { WeatherToClass } from './pipes/weather.weather-to-class';
import { WeatherToCloudBase } from './pipes/weather.weather-to-cloud-base';
import { Http, URLSearchParams } from '@angular/http';
import { WeatherService, Weather } from './services/weather.service'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { ReadableTime } from '../time/pipes/time.readable-time'
import 'chartjs';
@Component({
  selector: 'weather',
  templateUrl: 'weather.html',
  styleUrls: ['weather.less'],
  providers: [WeatherService]
})
export class WeatherComponent implements OnInit {
  weathers = new BehaviorSubject<Weather[]>(null);
  isLoad: boolean;
  @Input() city: string;
  chartData = new BehaviorSubject<ChartOptions>(null);
  chartOptions = {
    legend: {
      display: false
    },
    defaultFontColor: '#fff',
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
          stepSize: 5,
          callback: x => `${x}°`
        },
        gridLines: {
          display: false
        }
      }]
    }
  }

  constructor(private weatherService: WeatherService) { };

  ngOnInit() {
    this.getMeteo();
    window.setInterval(this.getMeteo, 1000 * 6);
    Chart.defaults.global['defaultFontColor'] = 'white';
  }

  getMeteo = () => {
    this.weatherService.getForcast(this.city).subscribe(data => {
      this.city = data.city;
      const weathers = data.weathers;
      const readableTime = new ReadableTime();
      const chartData: ChartOptions = {
        labels: weathers.map(x => readableTime.transform(x.date)),
        datasets: [
          {
            label: 'rain',
            borderColor: '#fff',
            borderWidth: 1,
            pointRadius: 0,
            backgroundColor: 'rgba(0,0,0,1)',
            data: weathers.map(x => x.rain)
          },
          {
            label: 'temp',
            borderColor: '#fff',
            borderWidth: 1,
            backgroundColor: 'rgba(255,255,255,0.1)',
            data: weathers.map(x => x.temp)
          }
        ]
      };
      if (this.shouldUpdate(this.chartData.getValue(), chartData)) {
        this.chartData.next(chartData);
        this.weathers.next(weathers);
      }
      this.isLoad = true;
    });
  }

  private shouldUpdate(options1: ChartOptions, options2: ChartOptions): boolean {
    return !(options1 && options2 && options1.labels[0] === options2.labels[0]);
  }
}

interface ChartOptions {
  labels: string[];
  datasets: ChartDataSet[]
}

interface ChartDataSet {
  label: string;
  backgroundColor?: string;
  borderColor: string;
  borderWidth: number;
  data: number[];
  pointRadius?: number;
}
