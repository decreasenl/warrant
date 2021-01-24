import { AfterContentInit, Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Directive({
  selector: '[resizeable]'
})
export class ResizeableDirective implements AfterContentInit {
  @Output() resized = new EventEmitter();
  @Input() resizeHandleSize = 10;

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
  onMouseUp(event: MouseEvent): void {
    this.dragging = false;
  }

  @HostListener('mousedown', ['$event']) onResize(event: MouseEvent): void {
    const { right } = this.target.getBoundingClientRect();
    if (event.clientX > (right - this.resizeHandleSize) && event.clientX < right) {
      this.dragging = true;
      this.x = event.clientX;
    }
    // this.y = event.clientY;
    event.stopPropagation();
  }

  @HostListener('mouseover', ['$event']) onMouseOver(event: MouseEvent): void {
    this.target.style.resize = 'horizontal';
  }

  @HostListener('mouseleave', ['$event']) onMouseLeave(event: MouseEvent): void {
    this.target.style.resize = 'none';
  }
}
