import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InternosRoutingModule } from './internos-routing.module';
import { InternosComponent } from './internos.component';
import { InternosService } from './internos.service';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedPipesModule, SortableTableModule, SumaColumnasModule, CloseButtonModule } from '../../shared';
import { UnidadesNv2Component } from './unidades-nv2.component';
import { UnidadesNv3Component } from './unidades-nv3.component';
import { UnidadesNv4Component } from './unidades-nv4.component';

@NgModule({
  imports: [
    CommonModule,
    InternosRoutingModule,
    FormsModule,
    SharedPipesModule,
    SortableTableModule,
    SumaColumnasModule,
    CloseButtonModule,
    NgbModule.forRoot()
  ],
  declarations: [InternosComponent, UnidadesNv2Component, UnidadesNv3Component, UnidadesNv4Component],
  providers: [
    InternosService
  ]
})
export class InternosModule { }
