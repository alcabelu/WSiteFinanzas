import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InternosRoutingModule } from './internos-routing.module';
import { InternosComponent } from './internos.component';
import { InternosService } from './internos.service';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedPipesModule, SortableTableModule } from '../../shared';

@NgModule({
  imports: [
    CommonModule,
    InternosRoutingModule,
    FormsModule,
    SharedPipesModule,
    SortableTableModule,
    NgbModule.forRoot()
  ],
  declarations: [InternosComponent],
  providers: [
    InternosService
  ]
})
export class InternosModule { }
