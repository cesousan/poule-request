import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-progress',
  standalone: true,
  template: `
    <progress 
      class="progress w-full" 
      [class.progress-primary]="type === 'primary'"
      [class.progress-success]="type === 'success'"
      [class.progress-warning]="type === 'warning'"
      [class.progress-error]="type === 'error'"
      [value]="value" 
      [max]="max"
    ></progress>
  `
})
export class ProgressComponent {
  @Input() value = 0;
  @Input() max = 100;
  @Input() type: 'primary' | 'success' | 'warning' | 'error' = 'primary';
} 