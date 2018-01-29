import { Component, OnInit, Input, Output, OnDestroy, EventEmitter } from '@angular/core';
import { IDetalleUnidadesMensual } from './detalle-unidades-mensual';
import { IDetalleUnidadesAcumulado } from './detalle-unidades-acumulado';
import { ColumnSortedEvent } from '../../shared/index';
import { ITipoUnidad } from './tipo-unidad';
import { InternosService } from './internos.service';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'int-unidades-nv2',
  templateUrl: './unidades-nv2.component.html',
  styleUrls: ['./internos.component.scss']
})
export class UnidadesNv2Component implements OnInit, OnDestroy {

  @Input() idDetalleUnidades: number;
  @Input() unidadesConcepto: string;
  @Input() mes: string;
  @Input() anio: string;
  @Input() selectedCompania: number;
  @Input() selectedSucursal: string;

  @Output() showUnidades = new EventEmitter<boolean>();
  @Output() showDetalleUnidadesPrimerNivel = new EventEmitter<boolean>();
  @Output() showDetalleUnidadesSegundoNivel = new EventEmitter<boolean>();
  @Output() detalleUnidadesNameSegundoNivel = new EventEmitter<string>();
  @Output() detalleUnidadesValueSegundoNivel = new EventEmitter<string>();
  @Output() detalleUnidadesConceptoSegundoNivel = new EventEmitter<string>();
  @Output() mesAcumulado = new EventEmitter<string>();
  @Output() departamentoAcumulado = new EventEmitter<string>();
  @Output() carLine = new EventEmitter<string>();
  @Output() errorMessage = new EventEmitter<string>();
  // @Output() fixedHeaderId = new EventEmitter<string>();

  detalleUnidadesMensual: IDetalleUnidadesMensual[];
  detalleUnidadesAcumulado: IDetalleUnidadesAcumulado[];

  dumSubscription: Subscription;
  duaSubscription: Subscription;

  constructor(private _service: InternosService) { }

  ngOnInit() {
    if (this.idDetalleUnidades === 1) { // Mensual
      this.getDetalleUnidadesMensual(this.unidadesConcepto);
    } else if (this.idDetalleUnidades === 2) { // Acumulado
      this.getDetalleUnidadesAcumulado(this.unidadesConcepto);
    }
  }

  ngOnDestroy() {
    if (this.idDetalleUnidades === 1) { // Mensual
      this.dumSubscription.unsubscribe();
    } else if (this.idDetalleUnidades === 2) { // Acumulado
      this.duaSubscription.unsubscribe();
    }
  }

  getDetalleUnidadesMensual(concepto: string): void {
    this.dumSubscription = this._service.getDetalleUnidadesMensual({
      idAgencia: this.selectedCompania,
      mSucursal: this.selectedSucursal,
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

    this.duaSubscription = this._service.getDetalleUnidadesAcumulado({
      idAgencia: this.selectedCompania,
      mSucursal: this.selectedSucursal,
      anio: this.anio,
      mes: this.mes,
      departamento: concepto
    }).subscribe(
      dua => { this.detalleUnidadesAcumulado = dua; },
      error => { console.log(error); }
    );
  }

  onClickDetalleUnidadesMensual(carLine: string, strMes: string, mes: string = '', depto: string = '') {
    if (carLine.trim() !== 'Total') {
      // TODO: Ocultar Suma
      this.showUnidades.emit(false);
      this.showDetalleUnidadesPrimerNivel.emit(false);
      this.showDetalleUnidadesSegundoNivel.emit(true);
      this.detalleUnidadesNameSegundoNivel.emit(strMes);
      this.detalleUnidadesValueSegundoNivel.emit(carLine); // Revisar ya que son 3 que usan el mismo valor
      this.detalleUnidadesConceptoSegundoNivel.emit(carLine);
      this.carLine.emit(carLine);
      this.mesAcumulado.emit(mes);
      this.departamentoAcumulado.emit(depto);
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
