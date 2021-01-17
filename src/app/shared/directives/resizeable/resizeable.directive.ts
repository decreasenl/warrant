import { getTranslationDeclStmts } from '@angular/compiler/src/render3/view/template';
import { AfterContentInit, Directive, ElementRef, HostListener, OnDestroy, OnInit, Output, Renderer2, RendererFactory2 } from '@angular/core';
import { EventType } from 'custom-electron-titlebar/lib/common/dom';
import { TouchBarScrubber } from 'electron';
import { fromEvent, Observable, of } from 'rxjs';
import { map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { getTarget } from 'src/app/core/helpers/helpers';

@Directive({
  selector: '[resizeable]'
})
export class ResizeableDirective implements AfterContentInit {

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

    this.target.style.width = `${this.width}px`;
    // console.log(this.target.style)
    // this.target.style.height = `${this.height}px`;

    this.x = event.clientX;
    // this.y = event.clientY;
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
