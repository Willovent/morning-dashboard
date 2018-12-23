import {
  Component,
  OnInit,
  ViewChildren,
  ComponentFactoryResolver,
  AfterViewInit,
  QueryList,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { DynamicComponentDirective } from './dynamic-component.directive';
import { IDynamicComponent } from './dynamic-component';
import { dynamicComponents } from './dynamic-component.decorator';

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
    this.httpClient.get<{ right: IDynamicComponent[], left: IDynamicComponent[] }>('/assets/layout.json').subscribe(layout => {
      this.leftTemplate = layout.left.map(this.stringToComp);
      this.rightTemplate = layout.right.map(this.stringToComp);
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
    comp.type = dynamicComponents[comp.type];
    return comp;
  }
}
