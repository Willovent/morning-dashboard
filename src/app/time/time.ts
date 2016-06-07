import { Component } from '@angular/core';
import { DayOfWeek } from './pipes/time.day-of-week'
import { MonthOfYear } from './pipes/time.month-of-year'
import { ReadableTime } from './pipes/time.readable-time'



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