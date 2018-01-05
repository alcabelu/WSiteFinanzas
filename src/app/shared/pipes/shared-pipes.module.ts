import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IvaPipe } from './iva.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [IvaPipe],
  exports: [
    IvaPipe
  ]
})
export class SharedPipesModule { }
