import { Component, OnInit, Input } from '@angular/core';
import { SchedulesToText } from './pipes/nextStop.schedulesToText';
import { NextStopService } from './services/nextStop.service'

@Component({
  moduleId: module.id,
  selector: 'next-stop',
  templateUrl: 'nextStop.html',
  styleUrls: ['nextStop.css'],
  pipes: [SchedulesToText],
  providers: [NextStopService]
})
export class NextStop implements OnInit {
  isLoad: boolean = false;
  @Input() type: string;
  @Input() ligne: string;
  @Input() station: string;
  @Input() direction: string;
  times: string[];
  constructor(private nextStopService :NextStopService) { }

  ngOnInit() {
    this.nextStopService.updateHoraire(this.type, this.ligne, this.station,this.direction)
    .subscribe(info => {
      this.type = info.type;
      this.ligne = info.ligne;
      this.station = info.station;
      this.times = info.times;  
      this.isLoad = true;  
    });
    setInterval(() => this.nextStopService.updateHoraire(this.type, this.ligne, this.station,this.direction)
    .subscribe(info => {
      this.type = info.type;
      this.ligne = info.ligne;
      this.station = info.station;
      this.times = info.times;    
    }), 10 * 1000)
  }  
}