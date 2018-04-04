import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SumaColumnasDirective } from './suma-columnas.directive';
import { SumaColumnasService } from './suma-columnas.service';
import { SumaColumnasComponent } from './suma-columnas.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [SumaColumnasDirective, SumaColumnasComponent],
  exports: [SumaColumnasDirective, SumaColumnasComponent],
  providers: [SumaColumnasService]
})
export class SumaColumnasModule { }
