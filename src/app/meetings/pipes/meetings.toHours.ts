import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'toHours' })
export class ToHours implements PipeTransform {
  transform(input: Date): string {
    if (!input) return "";
    let toReadableTime = (time: number) => ("0" + time).slice(-2);
    return `${toReadableTime(input.getHours())}:${toReadableTime(input.getMinutes())}`;
  }
}