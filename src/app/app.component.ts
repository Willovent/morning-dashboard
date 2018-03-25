import {
  Component,
  OnInit,
  ViewChildren,
  ComponentFactoryResolver,
  AfterViewInit,
  QueryList,
  ViewContainerRef
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { WeatherComponent } from './weather/weather';
import { DynamicComponentDirective } from './dynamic-component.directive';
import { TimeComponent } from './time/time';
import { NextStopComponent } from './nextstop/nextStop';
import { IDynamicComponent } from './dynamic-component';
import { MeetingsComponent } from './meetings/meetings';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChildren(DynamicComponentDirective) compos: QueryList<DynamicComponentDirective>;

  title = 'app';
  production = environment.production;
  rightTemplate: IDynamicComponent[];
  leftTemplate: IDynamicComponent[];

  constructor(private cfr: ComponentFactoryResolver, private httpClient: HttpClient) { }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    this.httpClient.get<{ rightTemplate: IDynamicComponent[], leftTemplate: IDynamicComponent[] }>('/assets/layout.json').subscribe(layout => {
      this.leftTemplate = layout.leftTemplate.map(this.stringToComp);
      this.rightTemplate = layout.rightTemplate.map(this.stringToComp);
      setTimeout(() => this.loadComponents());
    });

  }

  loadComponents() {
    this.compos.forEach(comp => {
      const fact = this.cfr.resolveComponentFactory(comp.comp.type)
      const ref = comp.viewContainerRef.createComponent(fact);
      Object.assign(ref.instance, comp.comp.props);
    })
  }

  stringToComp(comp: IDynamicComponent): IDynamicComponent {
    switch (comp.type) {
      case 'TimeComponent': return { ...comp, type: TimeComponent };
      case 'NextStopComponent': return { ...comp, type: NextStopComponent };
      case 'WeatherComponent': return { ...comp, type: WeatherComponent };
    }
  }
}
