import { Pipe, PipeTransform } from '@angular/core';


@Pipe({ name: 'schedulesToText' })
export class SchedulesToText implements PipeTransform {
  transform(input: string): string {
    const minutes = parseInt(input);
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
