import { Directive, HostListener, Input, EventEmitter, ElementRef, Renderer2, OnDestroy } from '@angular/core';
import { SumaColumnasService } from './suma-columnas.service';

@Directive({
  selector: '[suma-columnas]'
})
export class SumaColumnasDirective implements OnDestroy {

  ngOnDestroy(): void {
    // Cuando se destruye la directiva (se destruye la tabla que la contiene) mandar un -1 para indicarlo
    this.sumaColumnasService.add(-1);
  }

  constructor(private el: ElementRef, private renderer: Renderer2, private sumaColumnasService: SumaColumnasService) { }

  @Input('suma-columnas') valueSelected;

  @HostListener('click')
  onClick() {
    if (this.el.nativeElement.classList.contains('table-success')) {
      this.renderer.removeClass(this.el.nativeElement, 'table-success');
      this.sumaColumnasService.add(-this.valueSelected);
    } else {
      this.renderer.addClass(this.el.nativeElement, 'table-success');
      this.sumaColumnasService.add(this.valueSelected);
    }
  }

}
