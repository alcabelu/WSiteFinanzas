import { Directive, HostListener, Input, EventEmitter, ElementRef, Renderer2 } from '@angular/core';
import { SumaColumnasService } from './suma-columnas.service';

@Directive({
  selector: '[suma-columnas]'
})
export class SumaColumnasDirective {

  constructor(private el: ElementRef, private renderer :Renderer2, private sumaColumnasService: SumaColumnasService) { }

  @Input('suma-columnas') valueSelected;

  @HostListener('click')
  onClick() {
    if (this.el.nativeElement.classList.contains('table-success')) {
      this.renderer.removeClass(this.el.nativeElement, 'table-success');
      this.sumaColumnasService.add(-this.valueSelected);
    }
    else {
      this.renderer.addClass(this.el.nativeElement, 'table-success');
      this.sumaColumnasService.add(this.valueSelected);
    }
  }

}
