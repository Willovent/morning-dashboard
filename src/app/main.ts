import { Component } from '@angular/core';
import { Time } from './time/time'
import { Weather } from './weather/weather'



@Component({
  moduleId: module.id,
  selector: 'main',
  templateUrl: 'main.html',
  directives: [Time,Weather]
})
export class Main { }