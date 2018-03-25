import { Directive, ViewContainerRef, Input } from '@angular/core';
import { IDynamicComponent } from './dynamic-component';

@Directive({
  selector: '[appDynamicComponent]'
})
export class DynamicComponentDirective {

  // tslint:disable-next-line:no-input-rename
  @Input('appDynamicComponent') comp: IDynamicComponent;

  constructor(public viewContainerRef: ViewContainerRef) { }

}
