import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'weatherToCloudBase'})
export class WeatherToCloudBase implements PipeTransform {
  transform(value: string) : string {
     switch (value) {
                case '11': return 'basethundercloud';
                case '09': return 'basecloud';
                case '10': return 'basecloud';
                case '09': return 'basecloud';
                case '13': return 'basecloud';
                default:
                    return '';
            }
  }
}