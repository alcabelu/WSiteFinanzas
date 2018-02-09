import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InternosRoutingModule } from './internos-routing.module';
import { InternosComponent } from './internos.component';
import { InternosService } from './internos.service';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedPipesModule, SortableTableModule, SumaColumnasModule, CloseButtonModule, UtilsService } from '../../shared';
import { UnidadesNv2Component } from './unidades-nv2.component';
import { UnidadesNv3Component } from './unidades-nv3.component';
import { UnidadesNv4Component } from './unidades-nv4.component';
import { IntUnidadesNv1Component } from './int-unidades-nv1.component';
import { IntUnidadesNv2Component } from './int-unidades-nv2.component';
import { BreadcrumbService } from './breadcrumb.service';
import { IntUnidadesNv3Component } from './int-unidades-nv3.component';
import { IntUnidadesNv4Component } from './int-unidades-nv4.component';

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
  declarations: [
    InternosComponent,
    UnidadesNv2Component,
    UnidadesNv3Component,
    UnidadesNv4Component,
    IntUnidadesNv1Component,
    IntUnidadesNv2Component,
    IntUnidadesNv3Component,
    IntUnidadesNv4Component
  ],
  providers: [
    InternosService,
    BreadcrumbService,
    UtilsService
  ]
})
export class InternosModule { }
