import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InternosComponent } from './internos.component';
import { UnidadesNv3Component } from './unidades-nv3.component';
import { IntUnidadesNv1Component } from './int-unidades-nv1.component';
import { IntUnidadesNv2Component } from './int-unidades-nv2.component';
import { IntUnidadesNv3Component } from './int-unidades-nv3.component';
import { IntUnidadesNv4Component } from './int-unidades-nv4.component';

const routes: Routes = [
  {
    path: '',
    component: InternosComponent,
    children: [
      { path: 'unidades/nv1/:idCia/:idSuc/:mes/:anio', component: IntUnidadesNv1Component },
      { path: 'unidades/nv2/:idCia/:idSuc/:mes/:anio/:idAcumulado/:concepto', component: IntUnidadesNv2Component },
      // Falta caso para flotillas (usar parametros opcionales)
      { path: 'unidades/nv3/:idCia/:idSuc/:mes/:anio/:idAcumulado/:concepto/:carLine', component: IntUnidadesNv3Component },
      { path: 'unidades/nv4/:idCia/:idSuc/:mes/:anio/:idAcumulado/:concepto/:carLine/:tipoAuto', component: IntUnidadesNv4Component }
    ]
  }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class InternosRoutingModule { }
