import { Component, OnInit, OnDestroy } from '@angular/core';
import { SumaColumnasService } from './suma-columnas.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'wsf-suma-columnas',
  template: `<div *ngIf='suma > 0' class="card-footer">
               <span>Suma: {{ suma | number:'1.0-2' }}</span>
             </div>`,
  // templateUrl: './suma-columnas.component.html',
  styleUrls: ['./suma-columnas.component.scss']
})
export class SumaColumnasComponent implements OnInit, OnDestroy {

  private suma: number = 0;
  private subscription: Subscription;

  constructor(private sumaColumnasService: SumaColumnasService) { }

  ngOnInit() {
    this.subscription = this.sumaColumnasService.suma$.subscribe(value => {
      this.suma += value;
      if (this.suma < 0.01) this.suma = 0; //Fix para decimales 0.0000000001
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe;
  }

}
