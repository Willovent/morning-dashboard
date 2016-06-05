import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'dayOfWeek'})
export class DayOfWeek implements PipeTransform {
  transform(value: Date) : string {
    switch (value.getDay()) {
            case 1: return 'lundi';
            case 2: return 'mardi';
            case 3: return 'mercredi';
            case 4: return 'jeudi';
            case 5: return 'vendredi';
            case 6: return 'samedi';
            case 0: return 'dimanche';
        }
  }
}