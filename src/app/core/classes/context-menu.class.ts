import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

import { ContextMenuConfig } from '../interfaces/context-menu-config.interface';

@Injectable({
  providedIn: 'root'
})
export class ContextMenu {
  private renderer: Renderer2;
  private isShowing = false;
  private menu: object;

  constructor(private rendererFactory: RendererFactory2) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  public show(contextConfig: ContextMenuConfig): void {
    if (this.isShowing) {
      this.close();
    }

    this.menu = this.renderer.createElement('ul');

    this.renderer.addClass(this.menu, 'context-menu');
    this.renderer.setStyle(this.menu, 'top', `${contextConfig.top}px`);
    this.renderer.setStyle(this.menu, 'left', `${contextConfig.left}px`);

    contextConfig.options.forEach(option => {

      const li = this.renderer.createElement('li');
      this.renderer.listen(li, 'click', (...args: Array<any>) => {
        this.executeCallback(option.method, option, ...args);
      });

      this.renderer.addClass(li, 'context-menu-item');
      this.renderer.appendChild(li, this.renderer.createText(option.label));
      this.renderer.appendChild(this.menu, li);
    });

    this.renderer.appendChild(this.getRootElement(), this.menu);
    this.isShowing = true;

    this.renderer.listen(this.getRootElement(), 'click', () => {
      this.close();

      this.isShowing = false;
    });

  }

  private executeCallback(method: Function, ...args: Array<any>): void {
    return method(args);
  }

  public close(): void {
    this.renderer.removeChild(this.getRootElement(), this.menu);
  }

  private getRootElement(): any {
    return this.renderer.selectRootElement('body', true);
  }
}
