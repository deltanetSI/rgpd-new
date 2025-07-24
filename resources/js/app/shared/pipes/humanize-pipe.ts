import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'humanize',
  standalone: true,
})
export class HumanizePipe implements PipeTransform {

  transform(value: string): string {
    if (!value || typeof value !== 'string') return value;

    if (!value.includes('-')) return value;

    const result = value.replace(/-/g, ' ');

    return result.charAt(0).toUpperCase() + result.slice(1);
  }
  
}
