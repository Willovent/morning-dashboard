import { Component, OnInit, Input, Pipe, PipeTransform } from '@angular/core';
import { Http } from '@angular/http';

let configNextStop = {
  apiPattern: function (type, ligne, station, direction) {
    type = type.toLowerCase();
    station = station.toLowerCase().replace(/\s/g, '+');
    direction = direction.toLowerCase().replace(/\s/g, '+');
    return `http://api-ratp.pierre-grimaud.fr/v2/${type}/${ligne}/stations/${station}?destination=${direction}`;
  }
}

@Pipe({ name: "schedulesToText" })
export class SchedulesToText implements PipeTransform {
  transform(input: string): string {
    var minutes = parseInt(input);
    if (minutes) {
      return `Prochain départ dans ${minutes} minutes`;
    } else if (input === `A l'approche` || input === '0 mn') {
      return `À l'approche !`;
    } else if (input === `A l'arret`) {
      return `À l'arrêt !`;
    } else if (input === 'PERTURBATIONS') {
      return `Perturbations`;
    } else {
      return `Service terminé`;
    }
  }
}

@Component({
  moduleId: module.id,
  selector: 'next-stop',
  templateUrl: 'nextStop.html',
  styleUrls: ['nextStop.css'],
  pipes: [SchedulesToText]
})
export class NextStop implements OnInit {
  isLoad: boolean;
  @Input() type: string;
  @Input() ligne: string;
  @Input() station: string;
  @Input() direction: string;
  times: string[];
  constructor(private http: Http) { }

  ngOnInit() {
    this.updateHoraire();
    setInterval(this.updateHoraire, 10 * 1000)
  }

  updateHoraire = () => {
    this.http.get(configNextStop.apiPattern(this.type, this.ligne, this.station, this.direction))
      .subscribe((res) => {
        let data = res.json();
        this.type = data.response.informations.type;
        this.station = data.response.informations.station.name;
        this.times = []
        for (let schedule of data.response.schedules) {
          this.times.push(schedule.message);
        }
        this.ligne = data.response.informations.line;
        this.isLoad = true;
      });
  };
}

