import { Component, OnInit, OnDestroy } from '@angular/core';
import { ISeries } from './series';
import { IBreadcrumb, BreadcrumbService } from './breadcrumb.service';
import { InternosService } from './internos.service';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

@Component({
  templateUrl: './int-unidades-nv4.component.html',
  styleUrls: ['./int-unidades-nv4.component.scss', './internos.component.scss']
})
export class IntUnidadesNv4Component implements OnInit, OnDestroy {
  breadcrumbs: IBreadcrumb[] = [];
  subscription: Subscription;
  // detalleUnidadesSeries: ISeries[];

  idCia: string;
  idSucursal: string;
  mes: string;
  anio: string;
  concepto: string;
  idAcumulado: number;
  depto: string;
  idReporte: number;

  // @Input() deptoFlotillas: string;

  detalleUnidadesSeries: Observable<ISeries[]>;

  constructor(private _service: InternosService, private _breadcrumbService: BreadcrumbService, private _route: ActivatedRoute) {
    this.idCia = this._route.snapshot.params['idCia'];
    this.idSucursal = this._route.snapshot.params['idSuc'];
    this.mes = this._route.snapshot.params['mes'];
    this.anio = this._route.snapshot.params['anio'];
    this.concepto = this._route.snapshot.params['concepto'];
    this.idReporte = this._route.snapshot.params['idReporte'];
    // this.idAcumulado = +this._route.snapshot.params['idAcumulado'];
   }

  ngOnInit() {
    // Breadcrumbs
    this.subscription = this._breadcrumbService.breadcrumb$.subscribe(
      bc => {
        this.breadcrumbs = bc;
      }
    );
    this._breadcrumbService.getBreadcrumbs();

    this.detalleUnidadesSeries = this.getDetalleUnidadesSeries();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getDetalleUnidadesSeries(): Observable<ISeries[]> {
    // Se usa como parametro de departamento el texto de Concepto del primer nivel,
    // sin las letras N o S que se le agregan al inicio
    let concepto = this._breadcrumbService.getConcepto(1);

    if (concepto.startsWith('N ')) {
      concepto = concepto.substr(2);
    } else if (concepto.startsWith('S ')) {
      concepto = concepto.substr(2);
    }

    return this._service.getDetalleUnidadesSeries({
      idAgencia: this.idCia,
      mSucursal: this.idSucursal,
      anio: this.anio,
      // Cuando se manda a llamar desde acumulado (lado verde) contiene el parametro de mes
      mes: this.mes,
      departamento: concepto,
      // departamento: concepto === 'FLOTILLAS' ? this.deptoFlotillas : concepto,
      idEstadoDeResultado: 1, // QUITAR HARD CODE CUANDO TIBERIO COMPLETE EL SP
      idReporte: this.idReporte,
      carLine: this._breadcrumbService.getConcepto(2),
      tipoAuto: this._breadcrumbService.getConcepto(3)
    });
  }
}
