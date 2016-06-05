import { Component } from '@angular/core';
import { Time } from './time/time'



@Component({
  moduleId: module.id,
  selector: 'main',
  templateUrl: 'main.html',
  directives: [Time]
})
export class Main { }