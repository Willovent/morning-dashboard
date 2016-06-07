import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'weatherToClass'})
export class WeatherToClass implements PipeTransform {
  transform(value: string) : string {
     switch (value) {
                case '11': return 'icon-thunder';
                case '09': return 'icon-drizzle';
                case '10': return 'icon-drizzle icon-sunny';
                case '09': return 'icon-showers';
                case '13': return 'icon-snowy';
                case '50': return 'icon-mist';
                case '01': return 'icon-sun';
                case '02': return 'icon-cloud';
                case '04': return 'icon-cloud';
                case '03': return 'icon-cloud';
                default:
                    return '';
            }
  }
}