import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tagColor',
  standalone: true
})
export class TagColorPipe implements PipeTransform {
  private static readonly colors = [
    'badge-primary',
    'badge-secondary',
    'badge-accent',
    'badge-info',
    'badge-success',
    'badge-warning',
  ];

  private static colorMap = new Map<string, string>();

  transform(tag: string): string {
    if (!TagColorPipe.colorMap.has(tag)) {
      const colorIndex = TagColorPipe.colorMap.size % TagColorPipe.colors.length;
      TagColorPipe.colorMap.set(tag, TagColorPipe.colors[colorIndex]);
    }
    return TagColorPipe.colorMap.get(tag)!;
  }
} 