import { Directive, ElementRef, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';

@Directive({
  selector: '[appIntersectionObserver]',
  standalone: true
})
export class IntersectionObserverDirective implements OnInit, OnDestroy {
  @Output() intersecting = new EventEmitter<boolean>();
  
  private observer: IntersectionObserver;
  private hasEmitted = false;

  constructor(private element: ElementRef) {
    this.observer = new IntersectionObserver(
      ([entry]) => {
        // Only emit once when element becomes visible
        if (entry.isIntersecting && !this.hasEmitted) {
          this.hasEmitted = true;
          this.intersecting.emit(true);
          // Stop observing after first intersection
          this.observer.unobserve(this.element.nativeElement);
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '50px' // Start loading a bit before element comes into view
      }
    );
  }

  ngOnInit() {
    this.observer.observe(this.element.nativeElement);
  }

  ngOnDestroy() {
    this.observer.disconnect();
  }
} 