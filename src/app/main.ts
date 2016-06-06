import { Component } from '@angular/core';
import { Time } from './time/time'
import { Weather } from './weather/weather'
import { Meetings } from './meetings/meetings'
import { NextStop } from './nextstop/nextstop'



@Component({
  moduleId: module.id,
  selector: 'main',
  templateUrl: 'main.html',
  directives: [Time, Weather, Meetings, NextStop]
})
export class Main { }