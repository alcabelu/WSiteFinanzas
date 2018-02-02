import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, Router } from '@angular/router';

import { InternosService } from './internos.service';
import { IDetalleUnidadesMensual } from './detalle-unidades-mensual';
import { IDetalleUnidadesAcumulado } from './detalle-unidades-acumulado';
import { ColumnSortedEvent } from '../../shared/index';
import { BreadcrumbService, IBreadcrumb } from './breadcrumb.service';
import { Observable } from 'rxjs/Observable';

@Component({
  templateUrl: './int-unidades-nv2.component.html',
  styleUrls: ['./int-unidades-nv2.component.scss', './internos.component.scss']
})
export class IntUnidadesNv2Component implements OnInit, OnDestroy {
  idCia: string;
  idSucursal: string;
  mes: string;
  anio: string;
  concepto: string;
  idAcumulado: number;

  detalleUnidadesMensual: IDetalleUnidadesMensual[];
  detalleUnidadesAcumulado: IDetalleUnidadesAcumulado[];
  breadcrumbs: IBreadcrumb[];

  private Subscription: Subscription;

  constructor(private _service: InternosService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _breadcrumbService: BreadcrumbService) { }

  ngOnInit() {
    this.idCia = this._route.snapshot.params['idCia'];
    this.idSucursal = this._route.snapshot.params['idSuc'];
    this.mes = this._route.snapshot.params['mes'];
    this.anio = this._route.snapshot.params['anio'];
    this.concepto = this._route.snapshot.params['concepto'];
    this.idAcumulado = +this._route.snapshot.params['idAcumulado'];

    if (this.idAcumulado === 1) { // Mensual
      this.getDetalleUnidadesMensual(this.concepto);
    } else if (this.idAcumulado === 2) { // Acumulado
      this.getDetalleUnidadesAcumulado(this.concepto);
    }

    // Breadcrumbs
    this._breadcrumbService.breadcrumb$.subscribe(
      bc => { this.breadcrumbs = bc; }
    );
    this._breadcrumbService.getBreadcrumbs();
  }

  ngOnDestroy() {
    this.Subscription.unsubscribe();
  }

  breadcrumbsRouting(breadcrumb: IBreadcrumb) {
    this._breadcrumbService.updateBreadcrumbs(breadcrumb.index);
    this._router.navigateByUrl(breadcrumb.url);
  }

  getDetalleUnidadesMensual(concepto: string): void {
    this.Subscription = this._service.getDetalleUnidadesMensual({
      idAgencia: this.idCia,
      mSucursal: this.idSucursal,
      anio: this.anio,
      mes: this.mes,
      concepto: concepto
    }).subscribe(
      dum => { this.detalleUnidadesMensual = dum; },
      error => { console.log(error); }
    );
  }

  getDetalleUnidadesAcumulado(concepto: string): void {
    // Se usa como parametro de departamento el texto de Concepto del primer nivel,
    // sin las letras N o S que se le agregan al inicio
    if (concepto.startsWith('N ')) {
      concepto = concepto.substr(2);
    } else if (concepto.startsWith('S ')) {
      concepto = concepto.substr(2);
    }

    this.Subscription = this._service.getDetalleUnidadesAcumulado({
      idAgencia: this.idCia,
      mSucursal: this.idSucursal,
      anio: this.anio,
      mes: this.mes,
      departamento: concepto
    }).subscribe(
      dua => { this.detalleUnidadesAcumulado = dua; },
      error => { console.log(error); }
    );
  }

  onClickDetalleUnidadesMensual(carLine: string, mes: string = '', depto: string = '') {
    if (carLine.trim() !== 'Total') {
      // Cuando no viene el parametro de mes, significa que es reporte mensual y se usa el mes que viene del nivel anterior
      mes = mes === '' ? this.mes : mes;

      const bc: IBreadcrumb = { text: this.concepto + this.idCia, url: this._router.url, index: 1, active: true };
      this._breadcrumbService.addBreadcrumb(bc);
      this._router.navigate(['./unidades/nv3', this.idCia, this.idSucursal, this.mes, this.anio, carLine, this.idAcumulado ]);
    }
  }

  // Ordenamiento de tabla
  onSorted(event: ColumnSortedEvent, obj: Object[]) {
    // Se pasa como referencia el objeto que se quiere ordenar
    obj.sort(function (a, b) {
      if (event.sortDirection === 'asc') {
        return a[event.sortColumn] - b[event.sortColumn];
      } else {
        return b[event.sortColumn] - a[event.sortColumn];
      }
    });
  }

}
