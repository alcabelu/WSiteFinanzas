import { Component, OnInit, OnDestroy } from '@angular/core';
import { BreadcrumbService, IBreadcrumb } from './breadcrumb.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ITipoUnidad } from './tipo-unidad';
import { Subscription } from 'rxjs/Subscription';
import { InternosService } from './internos.service';
import { ColumnSortedEvent, UtilsService } from '../../shared/index';

@Component({
  templateUrl: './int-unidades-nv3.component.html',
  styleUrls: ['./int-unidades-nv3.component.scss', './internos.component.scss']
})
export class IntUnidadesNv3Component implements OnInit, OnDestroy {
  breadcrumbs: IBreadcrumb[] = [];
  detalleUnidadesTipo: ITipoUnidad[];

  idCia: string;
  idSucursal: string;
  mes: string;
  anio: string;
  concepto: string;
  idAcumulado: number;
  depto: string;


  private unidadesTipoSubscription: Subscription;

  constructor(
    private _service: InternosService,
    private _breadcrumbService: BreadcrumbService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _utils: UtilsService
  ) {
    this.idCia = this._route.snapshot.params['idCia'];
    this.idSucursal = this._route.snapshot.params['idSuc'];
    this.mes = this._route.snapshot.params['mes'];
    this.anio = this._route.snapshot.params['anio'];
    this.concepto = this._route.snapshot.params['concepto'];
    this.idAcumulado = +this._route.snapshot.params['idAcumulado'];
  }

  ngOnInit() {
    // Breadcrumbs
    this._breadcrumbService.breadcrumb$.subscribe(
      bc => {
        this.breadcrumbs = bc;
      }
    );
    this._breadcrumbService.getBreadcrumbs();

    if (this.idAcumulado === 1) { // mensual
      this.getDetalleUnidadesTipo(this.concepto, this.depto, this.mes);
    } else { // acumulado
      // HARD CODE. en la version prod, siempre muestra los 12 meses (wtf)
      this.getDetalleUnidadesTipoAcumulado(this.concepto, this.depto, '12');
    }
  }

  breadcrumbsRouting(breadcrumb: IBreadcrumb) {
    this._breadcrumbService.updateBreadcrumbs(breadcrumb.index);
    this._router.navigateByUrl(breadcrumb.url);
  }

  ngOnDestroy() {
    this.unidadesTipoSubscription.unsubscribe();
  }

  getDetalleUnidadesTipo(carLine: string, tipoAuto: string = '', mes: string): void {
    // Se usa como parametro de departamento el texto de Concepto del primer nivel,
    // sin las letras N o S que se le agregan al inicio
    let concepto = this._breadcrumbService.getConcepto(1);
    if (concepto.startsWith('N ')) {
      concepto = concepto.substr(2);
    } else if (concepto.startsWith('S ')) {
      concepto = concepto.substr(2);
    }

    // this.deptoFlotillas.emit(tipoAuto); // Se usa el departamento que aparece solo para flotillas en el segundo nivel

    this.unidadesTipoSubscription = this._service.getDetalleUnidadesTipo({
      idAgencia: this.idCia,
      mSucursal: this.idSucursal,
      anio: this.anio,
      mes: mes === '' ? this.mes : mes, // Cuando se manda a llamar desde acumulado (lado verde) contiene el parametro de mes
      departamento: concepto,
      // Para el caso de flotillas el sp cambia carLine por tipoAuto (columna depto aparece solo para flotillas)
      carLine: concepto === 'FLOTILLAS' ? tipoAuto : carLine,
      tipoAuto: concepto === 'FLOTILLAS' ? carLine : tipoAuto
    }).subscribe(
      unidadesTipo => { this.detalleUnidadesTipo = unidadesTipo; },
      error => { console.log(error); }
    );
  }

  getDetalleUnidadesTipoAcumulado(carLine: string, tipoAuto: string = '', mes: string): void {
    // Se usa como parametro de departamento el texto de Concepto del primer nivel,
    // sin las letras N o S que se le agregan al inicio
    let concepto = this._breadcrumbService.getConcepto(1);

    if (concepto.startsWith('N ')) {
      concepto = concepto.substr(2);
    } else if (concepto.startsWith('S ')) {
      concepto = concepto.substr(2);
    }

    // this.deptoFlotillas.emit(tipoAuto); // Se usa el departamento que aparece solo para flotillas en el segundo nivel

    this.unidadesTipoSubscription = this._service.getDetalleUnidadesTipoAcumulado({
      idAgencia: this.idCia,
      mSucursal: this.idSucursal,
      anio: this.anio,
      mes: mes === '' ? this.mes : mes, // Cuando se manda a llamar desde acumulado (lado verde) contiene el parametro de mes
      departamento: concepto,
      // Para el caso de flotillas el sp cambia carLine por tipoAuto (columna depto aparece solo para flotillas)
      carLine: concepto === 'FLOTILLAS' ? tipoAuto : carLine,
      tipoAuto: concepto === 'FLOTILLAS' ? carLine : tipoAuto
    }).subscribe(
      unidadesTipoAcumulado => { this.detalleUnidadesTipo = unidadesTipoAcumulado; },
      error => { console.log(error); }
    );
  }

  onClickDetalleUnidadesTipo(tipoUnidad: string, mes: string = '') {
    if (tipoUnidad.trim() !== 'Total') {
      const idReporte = this.idAcumulado === 1 ? 'MRQ' : 'ARQ'; // 1 = mensual y 2 = Acumulado
      mes = mes === '' ? this.mes : mes;

      const bc: IBreadcrumb = { text: `${tipoUnidad} (${this._utils.toLongMonth(mes)})`, url: this._router.url, index: 2, active: true };
      this._breadcrumbService.addBreadcrumb(bc);
      this._router.navigate(['./unidades/nv4', this.idCia, this.idSucursal, this.mes, this.anio, tipoUnidad, this.idAcumulado, idReporte ]);

      // this.fixedHeader('detalleUnidadesSeries');
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
