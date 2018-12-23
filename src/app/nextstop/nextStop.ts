import { Component, OnInit, Input } from '@angular/core';
import { NextStopService } from './services/nextStop.service'
import { dynamic } from 'app/dynamic-component.decorator';
@dynamic('next-stop')
@Component({
  moduleId: module.id,
  selector: 'next-stop',
  templateUrl: 'nextStop.html',
  styleUrls: ['nextStop.less'],
  providers: [NextStopService]
})
export class NextStopComponent implements OnInit {
  isLoad = false;
  @Input() type: string;
  @Input() ligne: string;
  @Input() station: string;
  @Input() direction: string;
  times: string[];
  constructor(private nextStopService: NextStopService) { }

  ngOnInit() {
    this.getNextStop();
    setInterval(() => this.getNextStop(), 10 * 1000);
  }

  private getNextStop = () => {
    this.nextStopService.updateHoraire(this.type, this.ligne, this.station, this.direction)
      .subscribe(info => {
        this.type = info.type;
        this.ligne = info.ligne;
        this.station = info.station;
        this.times = info.times;
        this.isLoad = true;
      });
  }
}
