import { Component, OnInit, Input, Output, OnDestroy, EventEmitter } from '@angular/core';
import { InternosService } from './internos.service';
import { ITipoUnidad } from './tipo-unidad';
import { Observable } from 'rxjs/Observable';
import { ColumnSortedEvent } from '../../shared/index';
import { Subscription } from 'rxjs/Subscription';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'int-unidades-nv3',
  templateUrl: './unidades-nv3.component.html',
  styleUrls: ['./internos.component.scss']
})
export class UnidadesNv3Component implements OnInit, OnDestroy {

  @Input() idDetalleUnidades: number;
  @Input() detalleUnidadesConcepto: string;
  @Input() mes: string;
  @Input() mesAcumulado: string;
  @Input() anio: string;
  @Input() selectedCompania: number;
  @Input() selectedSucursal: string;
  @Input() carLine: string;
  @Input() departamentoAcumulado: string;
  @Input() detalleName: string;

  @Output() deptoFlotillas = new EventEmitter<string>();
  @Output() showUnidades = new EventEmitter<boolean>();
  @Output() showDetalleUnidadesPrimerNivel = new EventEmitter<boolean>();
  @Output() showDetalleUnidadesSegundoNivel = new EventEmitter<boolean>();
  @Output() showDetalleUnidadesTercerNivel = new EventEmitter<boolean>();
  @Output() detalleUnidadesNameTercerNivel = new EventEmitter<string>();
  @Output() detalleUnidadesValueTercerNivel = new EventEmitter<string>();
  @Output() detalleUnidadesConceptoTercerNivel = new EventEmitter<string>();
  @Output() mesAcumuladoNv3 = new EventEmitter<string>();
  @Output() idReporte = new EventEmitter<string>();
  @Output() fixedHeaderId = new EventEmitter<string>();

  private unidadesTipoSubscription: Subscription;
  detalleUnidadesTipo: ITipoUnidad[];

  constructor(private _service: InternosService) { }

  ngOnInit() {
    this.fixedHeaderId.emit('idDetalleUnidadesTipo');
    if (this.mesAcumulado === '') { // mensual
      this.getDetalleUnidadesTipo(this.carLine, this.departamentoAcumulado, this.mes);
    } else { // acumulado
        // HARD CODE. en la version prod, siempre muestra los 12 meses (wtf)
        this.getDetalleUnidadesTipoAcumulado(this.carLine, this.departamentoAcumulado, '12');
    }
  }

  ngOnDestroy() {
    this.unidadesTipoSubscription.unsubscribe();
  }

  getDetalleUnidadesTipo(carLine: string, tipoAuto: string = '', mes: string): void {
    // Se usa como parametro de departamento el texto de Concepto del primer nivel,
    // sin las letras N o S que se le agregan al inicio
    let concepto = this.detalleUnidadesConcepto;
    if (concepto.startsWith('N ')) {
      concepto = concepto.substr(2);
    } else if (concepto.startsWith('S ')) {
      concepto = concepto.substr(2);
    }

    this.deptoFlotillas.emit(tipoAuto); // Se usa el departamento que aparece solo para flotillas en el segundo nivel

    this.unidadesTipoSubscription = this._service.getDetalleUnidadesTipo({
      idAgencia: this.selectedCompania,
      mSucursal: this.selectedSucursal,
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
    let concepto = this.detalleUnidadesConcepto;

    if (concepto.startsWith('N ')) {
      concepto = concepto.substr(2);
    } else if (concepto.startsWith('S ')) {
      concepto = concepto.substr(2);
    }

    this.deptoFlotillas.emit(tipoAuto); // Se usa el departamento que aparece solo para flotillas en el segundo nivel

    this.unidadesTipoSubscription = this._service.getDetalleUnidadesTipoAcumulado({
      idAgencia: this.selectedCompania,
      mSucursal: this.selectedSucursal,
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

  onClickDetalleUnidadesTipo(i: number, tipoUnidad: string, strMes: string = '', mes: string = '') {
    if (tipoUnidad.trim() !== 'Total') {
      const idReporte = this.detalleName === 'Real' ? 'MRQ' : 'ARQ'; // Real = mensual y AcReal = Acumulado

      this.showUnidades.emit(false);
      this.showDetalleUnidadesPrimerNivel.emit(false);
      this.showDetalleUnidadesSegundoNivel.emit(false);
      this.showDetalleUnidadesTercerNivel.emit(true);
      this.detalleUnidadesNameTercerNivel.emit(strMes);
      this.detalleUnidadesValueTercerNivel.emit(tipoUnidad);
      this.detalleUnidadesConceptoTercerNivel.emit(tipoUnidad);
      this.idReporte.emit(idReporte);
      this.mesAcumuladoNv3.emit(mes);
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
