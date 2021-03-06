import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChange } from '@angular/core';

import { ITipoUnidad } from '../../models/reports/tipo-unidad';

import { InternosService } from './internos.service';
import { Observable } from 'rxjs/Observable';
import { ColumnSortedEvent } from '../../shared/index';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'int-unidades-nv3',
  templateUrl: './unidades-nv3.component.html',
  styleUrls: ['./internos.component.scss']
})
export class UnidadesNv3Component implements OnInit, OnChanges {

  @Input() idDetalleUnidades: number;
  @Input() idAutoLinea: number;
  @Input() idOrigen: number;
  @Input() detalleUnidadesConcepto: string;
  @Input() mes: string;
  @Input() mesAcumulado: string;
  @Input() anio: string;
  @Input() selectedCompania: number;
  @Input() selectedIdSucursal: number;
  @Input() carLine: string;
  @Input() idDepartamento: string;
  @Input() detalleName: string;
  @Input() showPercents: boolean;

  @Input() isUnidadesDepto: boolean;
  @Input() selectedIdDepartamento: number;

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

  @Output() showUnidadesDepartamentoByLevel = new EventEmitter<number>();

  detalleUnidadesTipo: ITipoUnidad[];

  constructor(private _service: InternosService) { }

  ngOnInit() {
    this.fixedHeaderId.emit('idDetalleUnidadesTipo');
    if (this.isUnidadesDepto) {
      if (this.idDetalleUnidades === 1) { // Mensual
        this.getDetalleUnidadesTipo(this.carLine, this.idDepartamento, this.mes);
      } else if (this.idDetalleUnidades === 2) { // Acumulado
        this.getDetalleUnidadesTipoAcumulado(this.carLine, this.idDepartamento, this.mes);      }
    } else {
      if (this.idDetalleUnidades === 1) { // Mensual
        if (this.idOrigen === 3) { // Flotillas
          this.getDetalleUnidadesTipoFlotillas(this.carLine, this.idDepartamento, this.mes);
        } else {
          this.getDetalleUnidadesTipo(this.carLine, this.idDepartamento, this.mes);
        }
      } else if (this.idDetalleUnidades === 2) { // Acumulado
        if (this.idOrigen === 3) {
          this.getDetalleUnidadesTipoAcumuladoFlotillas(this.carLine, this.idDepartamento, this.mes);
        } else {
          // En la version prod, siempre muestra los mismos meses que se escogieron desde un inicio
          this.getDetalleUnidadesTipoAcumulado(this.carLine, this.idDepartamento, this.mes);
        }
      }
    }
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    const changeProp = changes['showPercents'];
    if (changeProp) {
      this.showPercents = <boolean>changeProp.currentValue;
    }
  }

  getDetalleUnidadesTipo(carLine: string, idDepartamento: string = '', mes: string): void {
    // Se usa como parametro de departamento el texto de Concepto del primer nivel,
    // sin las letras N o S que se le agregan al inicio
    const concepto = this.detalleUnidadesConcepto;

    // this.deptoFlotillas.emit(tipoAuto); // Se usa el departamento que aparece solo para flotillas en el segundo nivel

    this._service.getDetalleUnidadesTipo({
      idCompania: this.selectedIdSucursal > 0 ? 0 : this.selectedCompania,
      idSucursal: this.selectedIdSucursal > 0 ? this.selectedIdSucursal : 0,
      idOrigen: this.idOrigen,
      periodoYear: +this.anio,
      periodoMes: +this.mes,
      idAutoLinea: this.idAutoLinea,
      idPestania: this.selectedIdDepartamento,
      isUnidadesDepto: this.isUnidadesDepto
    })
      .subscribe(
      dut => { this.detalleUnidadesTipo = dut; },
      error => { console.log(JSON.stringify(error)); },
      () => {
        this.calculaTotalesMensual();
      }
      );
  }

  // Flotillas
  getDetalleUnidadesTipoFlotillas(carLine: string, idDepartamento: string = '', mes: string): void {
    // Se usa como parametro de departamento el texto de Concepto del primer nivel,
    // sin las letras N o S que se le agregan al inicio
    const concepto = this.detalleUnidadesConcepto;

    // this.deptoFlotillas.emit(idDepartamento); // Se usa el departamento que aparece solo para flotillas en el segundo nivel

    this._service.getDetalleUnidadesTipoFlotillas({
      idDepartamento: this.idDepartamento,
      idCompania: this.selectedIdSucursal > 0 ? 0 : this.selectedCompania,
      idSucursal: this.selectedIdSucursal > 0 ? this.selectedIdSucursal : 0,
      idOrigen: this.idOrigen,
      periodoYear: +this.anio,
      periodoMes: +this.mes,
      idAutoLinea: this.idAutoLinea
    })
      .subscribe(
      dut => { this.detalleUnidadesTipo = dut; },
      error => { console.log(JSON.stringify(error)); },
      () => {
        // Se calcula el total y se inserta en el objeto
        const total: number = this.calculaTotalMensual(this.detalleUnidadesTipo, 'Cantidad');
        const t: ITipoUnidad = {
          'UnidadDescripcion': 'Total',
          'Cantidad': total,
          'Perc': 100,
          'enero': 0,
          'eneroPerc': 100,
          'febrero': 0,
          'febreroPerc': 100,
          'marzo': 0,
          'marzoPerc': 100,
          'abril': 0,
          'abrilPerc': 100,
          'mayo': 0,
          'mayoPerc': 100,
          'junio': 0,
          'junioPerc': 100,
          'julio': 0,
          'julioPerc': 100,
          'agosto': 0,
          'agostoPerc': 100,
          'septiembre': 0,
          'septiembrePerc': 100,
          'octubre': 0,
          'octubrePerc': 100,
          'noviembre': 0,
          'noviembrePerc': 100,
          'diciembre': 0,
          'diciembrePerc': 100,
          'totalAnual': 0,
          'totalAnualPerc': 100
        };
        this.detalleUnidadesTipo.push(t);

        // Se calculan porcentajes
        this.detalleUnidadesTipo.forEach(dut => dut.Perc = dut.Cantidad / total * 100);
      }
      );
  }

  private calculaTotalMensual(items, prop) {
    return items.reduce(function (a, b) {
      return a + b[prop];
    }, 0);
  }

  getDetalleUnidadesTipoAcumulado(carLine: string, idDepartamento: string = '', mes: string) {
    // Se usa como parametro de departamento el texto de Concepto del primer nivel,
    // sin las letras N o S que se le agregan al inicio
    const concepto = this.detalleUnidadesConcepto;

    // this.deptoFlotillas.emit(tipoAuto); // Se usa el departamento que aparece solo para flotillas en el segundo nivel

    this._service.getDetalleUnidadesTipoAcumulado({
      idCompania: this.selectedIdSucursal > 0 ? 0 : this.selectedCompania,
      idSucursal: this.selectedIdSucursal > 0 ? this.selectedIdSucursal : 0,
      idOrigen: this.idOrigen,
      periodoYear: +this.anio,
      periodoMes: mes,
      idAutoLinea: this.idAutoLinea,
      idPestania: this.selectedIdDepartamento,
      isUnidadesDepto: this.isUnidadesDepto
    }).subscribe(
      dut => { this.detalleUnidadesTipo = dut; },
      error => { console.log(JSON.stringify(error)); },
      () => {
        const totales: ITipoUnidad = {
          'UnidadDescripcion': 'Total',
          'Cantidad': 0,
          'Perc': 100,
          'enero': 0,
          'eneroPerc': 100,
          'febrero': 0,
          'febreroPerc': 100,
          'marzo': 0,
          'marzoPerc': 100,
          'abril': 0,
          'abrilPerc': 100,
          'mayo': 0,
          'mayoPerc': 100,
          'junio': 0,
          'junioPerc': 100,
          'julio': 0,
          'julioPerc': 100,
          'agosto': 0,
          'agostoPerc': 100,
          'septiembre': 0,
          'septiembrePerc': 100,
          'octubre': 0,
          'octubrePerc': 100,
          'noviembre': 0,
          'noviembrePerc': 100,
          'diciembre': 0,
          'diciembrePerc': 100,
          'totalAnual': 0,
          'totalAnualPerc': 100
        };

        // Ciclo de 12 meses
        for (let m = 1; m <= 12; m++) {
          const nombreMes = this.toLongMonth(m);

          // Se calcula el total
          const totalMensual: number = this.calculaTotalMensual(this.detalleUnidadesTipo, nombreMes);

          // Se actualiza el valor del mes correspondiente
          totales[nombreMes] = totalMensual;

          // Se calculan porcentajes del mes correspondiente
          this.detalleUnidadesTipo.forEach(dua => {
            dua[nombreMes + 'Perc'] = dua[nombreMes] / totalMensual * 100;
            dua.totalAnual = dua.enero + dua.febrero + dua.marzo + dua.abril + dua.mayo + dua.junio + dua.julio +
                             dua.agosto + dua.septiembre + dua.octubre + dua.noviembre + dua.diciembre;
            dua.totalAnualPerc = 0;
          });
        }

        // Se actualiza el total anual de todas las autoLineas
        totales.totalAnual = this.calculaTotalMensual(this.detalleUnidadesTipo, 'totalAnual');

        // Se calculan los porcentajes de totales
        this.detalleUnidadesTipo.forEach(dua => {
          dua.totalAnualPerc = dua.totalAnual / totales.totalAnual * 100;
        });

        // Se agregan totales al objeto
        this.detalleUnidadesTipo.push(totales);
      }
      );
  }

  getDetalleUnidadesTipoAcumuladoFlotillas(carLine: string, idDepartamento: string = '', mes: string) {
    // Se usa como parametro de departamento el texto de Concepto del primer nivel,
    // sin las letras N o S que se le agregan al inicio
    const concepto = this.detalleUnidadesConcepto;

    // this.deptoFlotillas.emit(tipoAuto); // Se usa el departamento que aparece solo para flotillas en el segundo nivel

    this._service.getDetalleUnidadesTipoAcumuladoFlotillas({
      idDepartamento: idDepartamento,
      idCompania: this.selectedIdSucursal > 0 ? 0 : this.selectedCompania,
      idSucursal: this.selectedIdSucursal > 0 ? this.selectedIdSucursal : 0,
      idOrigen: this.idOrigen,
      periodoYear: +this.anio,
      periodoMes: mes,
      idAutoLinea: this.idAutoLinea
    }).subscribe(
      dut => { this.detalleUnidadesTipo = dut; },
      error => { console.log(JSON.stringify(error)); },
      () => {
        const totales: ITipoUnidad = {
          'UnidadDescripcion': 'Total',
          'Cantidad': 0,
          'Perc': 100,
          'enero': 0,
          'eneroPerc': 100,
          'febrero': 0,
          'febreroPerc': 100,
          'marzo': 0,
          'marzoPerc': 100,
          'abril': 0,
          'abrilPerc': 100,
          'mayo': 0,
          'mayoPerc': 100,
          'junio': 0,
          'junioPerc': 100,
          'julio': 0,
          'julioPerc': 100,
          'agosto': 0,
          'agostoPerc': 100,
          'septiembre': 0,
          'septiembrePerc': 100,
          'octubre': 0,
          'octubrePerc': 100,
          'noviembre': 0,
          'noviembrePerc': 100,
          'diciembre': 0,
          'diciembrePerc': 100,
          'totalAnual': 0,
          'totalAnualPerc': 100
        };

        // Ciclo de 12 meses
        for (let m = 1; m <= 12; m++) {
          const nombreMes = this.toLongMonth(m);

          // Se calcula el total
          const totalMensual: number = this.calculaTotalMensual(this.detalleUnidadesTipo, nombreMes);

          // Se actualiza el valor del mes correspondiente
          totales[nombreMes] = totalMensual;

          // Se calculan porcentajes del mes correspondiente
          this.detalleUnidadesTipo.forEach(dua => {
            dua[nombreMes + 'Perc'] = dua[nombreMes] / totalMensual * 100;
            dua.totalAnual = dua.enero + dua.febrero + dua.marzo + dua.abril + dua.mayo + dua.junio + dua.julio +
                             dua.agosto + dua.septiembre + dua.octubre + dua.noviembre + dua.diciembre;
            dua.totalAnualPerc = 0;
          });
        }

        // Se actualiza el total anual de todas las autoLineas
        totales.totalAnual = this.calculaTotalMensual(this.detalleUnidadesTipo, 'totalAnual');

        // Se calculan los porcentajes de totales
        this.detalleUnidadesTipo.forEach(dua => {
          dua.totalAnualPerc = dua.totalAnual / totales.totalAnual * 100;
        });

        // Se agregan totales al objeto
        this.detalleUnidadesTipo.push(totales);
      }
      );
  }

  // Convierte mes numerico a nombre del mes
  toLongMonth(mes: number) {
    let mesStr = mes.toString();

    if (mes < 10) {
      mesStr = '0' + mesStr;
    }

    const objDate = new Date(mes + '/01/2000'),
      locale = 'es-mx',
      month = objDate.toLocaleString(locale, { month: 'long' });
    return month;
  }

  onClickDetalleUnidadesTipo(tipoUnidad: string, mes: string = '') {
    if (tipoUnidad.trim() !== 'Total') {
      const idReporte = this.detalleName === 'Real' ? 'MRQ' : 'ARQ'; // Real = mensual y AcReal = Acumulado

      if (this.isUnidadesDepto) {
        this.showUnidadesDepartamentoByLevel.emit(4);
      } else {
        this.showUnidades.emit(false);
        this.showDetalleUnidadesPrimerNivel.emit(false);
        this.showDetalleUnidadesSegundoNivel.emit(false);
        this.showDetalleUnidadesTercerNivel.emit(true);
      }

      this.detalleUnidadesNameTercerNivel.emit(mes);
      this.detalleUnidadesValueTercerNivel.emit(tipoUnidad);
      this.detalleUnidadesConceptoTercerNivel.emit(tipoUnidad);
      this.idReporte.emit(idReporte);
      this.mesAcumuladoNv3.emit(mes);
      // this.fixedHeader('detalleUnidadesSeries');
    }
  }

  private calculaTotalesMensual() {
    // Se calcula el total y se inserta en el objeto
    const total: number = this.calculaTotalMensual(this.detalleUnidadesTipo, 'Cantidad');
    const t: ITipoUnidad = {
      'UnidadDescripcion': 'Total',
      'Cantidad': total,
      'Perc': 100,
      'enero': 0,
      'eneroPerc': 100,
      'febrero': 0,
      'febreroPerc': 100,
      'marzo': 0,
      'marzoPerc': 100,
      'abril': 0,
      'abrilPerc': 100,
      'mayo': 0,
      'mayoPerc': 100,
      'junio': 0,
      'junioPerc': 100,
      'julio': 0,
      'julioPerc': 100,
      'agosto': 0,
      'agostoPerc': 100,
      'septiembre': 0,
      'septiembrePerc': 100,
      'octubre': 0,
      'octubrePerc': 100,
      'noviembre': 0,
      'noviembrePerc': 100,
      'diciembre': 0,
      'diciembrePerc': 100,
      'totalAnual': 0,
      'totalAnualPerc': 100
    };
    this.detalleUnidadesTipo.push(t);

    // Se calculan porcentajes
    this.detalleUnidadesTipo.forEach(dut => dut.Perc = dut.Cantidad / total * 100);
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
