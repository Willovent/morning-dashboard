import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'monthOfYear' })
export class MonthOfYear implements PipeTransform {
  transform(value: Date): string {
    switch (value.getMonth()) {
      case 1: return 'janvier';
      case 2: return 'fevrier';
      case 3: return 'mars';
      case 4: return 'avril';
      case 5: return 'mai';
      case 6: return 'juin';
      case 7: return 'juillet';
      case 8: return 'août';
      case 9: return 'septembre';
      case 10: return 'octobre';
      case 11: return 'novembre';
      case 12: return 'décembre';
    }
  }
}
