import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'readableTime' })
export class ReadableTime implements PipeTransform {
  transform(value: Date): string {
    const toReadableTime = (time: number) => ('0' + time).slice(-2);
    const hours = toReadableTime(value.getHours());
    const minutes = toReadableTime(value.getMinutes());
    return `${hours}:${minutes}`;
  }
}
