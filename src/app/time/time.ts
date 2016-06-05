import { Component } from '@angular/core';
import { DayOfWeek } from './time.day-of-week.pipe'
import { MonthOfYear } from './time.month-of-year.pipe'
import { ReadableTime } from './time.readable-time.pipe'



@Component({
  moduleId: module.id,
  selector: 'time',
  templateUrl: 'time.html',
  styleUrls: ['time.css'],
  pipes: [DayOfWeek, MonthOfYear,ReadableTime]  
})
export class Time {
    now: Date;
    constructor(){
      var updateTime = () => {
         this.now = new Date();
      };
      updateTime();
      window.setInterval(updateTime, 10000);
    }     
}