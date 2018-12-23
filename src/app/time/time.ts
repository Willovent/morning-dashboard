import { Component } from '@angular/core';
import { dynamic } from 'app/dynamic-component.decorator';


@dynamic('time')

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
