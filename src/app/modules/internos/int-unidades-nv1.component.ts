import { Component, OnInit } from '@angular/core';
import { IResultadoInternos } from './resultado-internos';
import { InternosService } from './internos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { BreadcrumbService, IBreadcrumb } from './breadcrumb.service';

@Component({
  templateUrl: './int-unidades-nv1.component.html',
  styleUrls: ['./int-unidades-nv1.component.scss', './internos.component.scss']
})
export class IntUnidadesNv1Component implements OnInit, OnDestroy {
  resultadoUnidades: IResultadoInternos[] = [];
  subscription: Subscription;
  idCia: string;
  idSucursal: string;
  mes: string;
  anio: string;

  constructor(
    private _service: InternosService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _breadcrumbService: BreadcrumbService) { }

  ngOnInit() {
    this._route.params.subscribe(
      params => {
        this.idCia = params['idCia'];
        this.idSucursal = params['idSuc'];
        this.mes = params['mes'];
        this.anio = params['anio'];

        this.getResultadoUnidades();
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getResultadoUnidades(): void {
    this.subscription = this._service.getUnidades({
      idCia: this.idCia,
      idSucursal: this.idSucursal,
      mes: this.mes,
      anio: this.anio
    })
      .subscribe(resultadoUnidades => {
        this.resultadoUnidades = resultadoUnidades;
      },
      error => { console.log(error); });
  }

  onClickUnidades(concepto: string, idAcumulado: number) {
    if (concepto !== 'Total Unidades') {
      const bc: IBreadcrumb = { text: 'idCIa: ' + this.idCia, url: this._router.url, index: 0, active: true };
      this._breadcrumbService.addBreadcrumb(bc);
      this._router.navigate(['./unidades/nv2', this.idCia, this.idSucursal, this.mes, this.anio, concepto, idAcumulado ]);
    }
  }

}
