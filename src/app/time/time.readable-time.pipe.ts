import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'readableTime'})
export class ReadableTime implements PipeTransform {
  transform(value: Date) : string {
        let toReadableTime = (time: number) => ("0" + time).slice(-2);
        let hours = toReadableTime(value.getHours());
        let minutes = toReadableTime(value.getMinutes());
        return `${hours}:${minutes}`;
  }
}