import { AfterContentInit, Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[resizeable]'
})
export class ResizeableDirective implements AfterContentInit {
  @Output() resized = new EventEmitter();

  height: number;
  width: number;
  // y = 0;
  x = 0;
  target: HTMLElement;
  dragging = false;

  constructor(private el: ElementRef) { }

  ngAfterContentInit(): void {
    this.target = (this.el.nativeElement as HTMLElement);
    this.height = this.target.offsetHeight;
    this.width = this.target.offsetWidth;

    this.target.style.cursor = 'col-resize';
  }

@HostListener('document:mousemove', ['$event'])
  drag(event: MouseEvent): void {
    if (!this.dragging) {
      return;
    }

    this.width += event.clientX - this.x;
    // this.height += event.clientY - this.y;

    this.x = event.clientX;
    // this.y = event.clientY;

    this.target.style.width = `${this.width}px`;
    // console.log(this.target.style)
    // this.target.style.height = `${this.height}px`;

    this.resized.emit(this.target);
  }

  @HostListener('document:mouseup', ['$event'])
  drop(event: MouseEvent): void {
    this.dragging = false;
    // console.log(this.target)
  }

  @HostListener('mousedown', ['$event']) onResize(event: MouseEvent): void {
    this.dragging = true;
    this.x = event.clientX;
    event.stopPropagation();
    // this.y = event.clientY;
  }
}
