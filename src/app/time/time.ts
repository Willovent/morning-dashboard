import { Component } from '@angular/core';
import { DayOfWeek } from './pipes/time.day-of-week'
import { MonthOfYear } from './pipes/time.month-of-year'
import { ReadableTime } from './pipes/time.readable-time'



@Component({
  selector: 'time',
  templateUrl: 'time.html',
  styleUrls: ['time.less']
})
export class TimeComponent {
  now: Date;
  constructor() {
    const updateTime = () => {
      this.now = new Date();
    };
    updateTime();
    window.setInterval(updateTime, 10000);
  }
}
