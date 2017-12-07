import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { TreeviewItem, TreeviewConfig } from 'ngx-treeview';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { trigger,style,transition,animate,keyframes,query,stagger,group, state, animateChild } from '@angular/animations';
import { IResultadoInternos } from './resultado-internos';
import { InternosService } from './internos.service';
import { ISucursal } from './sucursal';
import { ICompania } from './compania';
import { IDepartamento } from './departamento';
import { ITipoReporte } from './tipo-reporte';
import { IEfectivoSituacion } from './efectivo-y-situacion-financiera';

@Component({
  selector: 'app-internos',
  templateUrl: './internos.component.html',
  styleUrls: ['./internos.component.scss'],
  animations: [
    trigger('ngIfAnimation', [
      transition('void => *', [
          query('*', stagger('5ms', [
              animate('0.3s ease-in', keyframes([
                  style({opacity: 0, transform: 'translateY(-75%)', offset: 0}),
                  style({opacity: .5, transform: 'translateY(35px)', offset: 0.3}),
                  style({opacity: 1, transform: 'translateY(0)', offset: 1.0}),
                  ]))]), {optional: true}),
          ]),
      transition('* => void', [
          query('*', stagger('5ms', [
              animate('0.4s ease-in', keyframes([
                  style({opacity: 1, transform: 'translateY(0)', offset: 0}),
                  style({opacity: .5, transform: 'translateY(35px)', offset: 0.3}),
                  style({opacity: 0, transform: 'translateY(-75%)', offset: 1.0}),
                  ]))]), {optional: true}),
          ])
    ]),
    routerTransition()
  ]
})
export class InternosComponent implements OnInit {
  errorMessage: any;

  constructor(private _service: InternosService) { }

  showFilters = true;
  showUnidades = true;
  showResultados = true;
  showUnidadesDepartamento = true;
  showEfectivoSituacion = false;
  showReporteUnidades = true;
  showDetallePrimerNivel = false;
  showDetalleSegundoNivel = false;
  isCollapsed = true;

  resultadoUnidadesService: IResultadoInternos[] = [];
  estadoResultados: IResultadoInternos[] = [];
  unidadesDepartamento: IResultadoInternos[] = [];
  efectivoSituacion: IEfectivoSituacion[];
  companias: ICompania[];
  sucursales: ISucursal[];
  departamentos: IDepartamento[] = [];
  tipoReporte: ITipoReporte[];
  selectedCompania = 0;
  selectedTipoReporte = 1;
  selectedSucursal = 'AA';
  selectedDepartamento = 'Todos';
  mes: string;
  anio: string;
  periodo: string;
  detalleName: string;
  detalleValue: number;
  detalleConcepto: string;
  detalleNameSegundoNivel: string;
  detalleValueSegundoNivel: number;
  detalleConceptoSegundoNivel: string;

  resultadoUnidades: IResultadoInternos[] = [];

  ngOnInit() {
    this.setDefaultDate();
    this.setTipoReporte();
    this.getCompanias();
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  toggleUnidades(): void {
    this.showUnidades = !this.showUnidades;
  }

  toggleResultados(): void {
    this.showResultados = !this.showResultados;
  }

  toggleUnidadesDepartamento(): void {
    this.showUnidadesDepartamento = !this.showUnidadesDepartamento;
  }

  procesar(): void {
    let sTipoReporte = this.selectedTipoReporte.toString(); //Aunque se definio como number, la comparacion siempre lo toma como string
    let sCompania = this.selectedCompania.toString();

    if ((sTipoReporte === '4' || sTipoReporte === '5') && sCompania !== '0') {
      this.showReporteUnidades = false;
      this.showEfectivoSituacion = true;
      this.getEfectivoSituacion();
    }
    else if (sCompania !== '0') {
      this.showReporteUnidades = true;
      this.showEfectivoSituacion = false;
      this.getResultadoUnidades();
      this.getEstadoResultados();
      this.getUnidadesDepartamento();
    }
  }

  getResultadoUnidades(): void {
    this._service.getUnidades({
      idCia: this.selectedCompania,
      idSucursal: this.selectedSucursal,
      mes: this.mes,
      anio: this.anio
    })
      .subscribe(resultadoUnidades => {
        this.resultadoUnidades = resultadoUnidades;
      },
      error => this.errorMessage = <any>error);
  }

  getEstadoResultados(): void {
    this._service.getEstadoResultados({
      idCia: this.selectedCompania,
      idSucursal: this.selectedSucursal,
      departamento: this.selectedDepartamento,
      mes: this.mes,
      anio: this.anio
    })
      .subscribe(estadoResultados => {
        this.estadoResultados = estadoResultados;
      },
      error => this.errorMessage = <any>error);
  }

  getUnidadesDepartamento(): void {
    if (this.selectedDepartamento !== 'Todos') {
      this._service.getUnidadesDepartamento({
        idCia: this.selectedCompania,
        idSucursal: this.selectedSucursal,
        departamento: this.selectedDepartamento,
        mes: this.mes,
        anio: this.anio
      })
        .subscribe(unidadesDepartamento => {
          this.unidadesDepartamento = unidadesDepartamento;
        },
        error => this.errorMessage = <any>error);
    } else {
      this.unidadesDepartamento = [];
    }
  }

  getCompanias(): void {
    this._service.getCompanias({ idUsuario: 3 })
      .subscribe(companias => {
        this.companias = companias;
      },
      error => this.errorMessage = <any>error);
  }

  getSucursales(): void {
    this._service.getSucursales({
      idTipoReporte: this.selectedTipoReporte,
      idAgencia: this.selectedCompania
    })
      .subscribe(sucursales => {
        this.sucursales = sucursales;
      },
      error => this.errorMessage = <any>error);
  }

  getDepartamentos(): void {
    this._service.getDepartamentos({
      idReporte: this.selectedTipoReporte,
      idSucursal: this.selectedSucursal,
      idAgencia: this.selectedCompania,
      anio: this.anio,
      mes: this.mes
    })
      .subscribe(departamentos => {
        this.departamentos = departamentos;
      },
      error => this.errorMessage = <any>error);
  }

  setTipoReporte(): void {
    this.tipoReporte = [
      { Id: 1, Descripcion: 'Mensual' },
      { Id: 2, Descripcion: 'Acumulado Real' },
      { Id: 3, Descripcion: 'Acumulado Presupuestos' },
      { Id: 4, Descripcion: 'Flujo de Efectivo Real' },
      { Id: 5, Descripcion: 'Estado de Situación Financiera' }
    ];
  }

  setDefaultDate(): void {
    let today = new Date();
    let mes = today.getMonth() + 1;
    let mesStr = mes.toString();
    let anio = today.getFullYear().toString();

    if (mes < 10) {
      mesStr = '0' + mesStr;
    }

    this.mes = mesStr;
    this.anio = anio;
    this.periodo = anio + '-' + mesStr;
  }

  getEfectivoSituacion(): void {
    this._service.get_EfectivoSituacion({
      idTipoReporte: this.selectedTipoReporte,
      idAgencia: this.selectedCompania,
      anio: this.anio
    })
      .subscribe(efectivoSituacion => {
        this.efectivoSituacion = efectivoSituacion;
      },
      error => this.errorMessage = <any>error);
  }

  onChangePeriodo(selectedDate): void {
    if (selectedDate) {
      const mesStr = selectedDate.substring(5,7);
      const fullYearStr = selectedDate.substring(0,4);

      this.mes = mesStr;
      this.anio = fullYearStr;

      if(this.mes && this.anio && this.selectedCompania !== 0 && this.selectedSucursal) {
        this.getDepartamentos();
      }
    }
  }

  onChangeCompania(newValue): void {
    this.selectedCompania = newValue;

    if (this.selectedCompania !== 0 && this.selectedTipoReporte) {
      //Llenar dropdown de sucursales
        this.getSucursales();
    }

    if(this.periodo && this.selectedCompania !== 0 && this.selectedSucursal) {
      this.getDepartamentos();
    }
  }

  onChangeSucursal(newValue): void {
    this.selectedSucursal = newValue;

    if(this.periodo && this.selectedCompania !== 0 && this.selectedSucursal) {
      this.getDepartamentos();
    }
  }

  onChangeDepartamento(newValue): void {
    this.selectedDepartamento = newValue;
    console.log(newValue);
  }

  onChangeTipoReporte(newValue: number): void {
    this.selectedTipoReporte = newValue;
    const nv = newValue.toString();

    if (nv === '4' || nv === '5') {
      this.showReporteUnidades = false;
      this.sucursales = [];
      this.departamentos = [];
    }
    else {
      this.showReporteUnidades = true;
      this.setDefaultDate();
      this.getSucursales();
    }
  }



  onClickResultado(i: number, value: number, name: string) {
    this.showDetallePrimerNivel = true;
    this.detalleName = name;
    this.detalleValue = value;
    this.detalleConcepto = this.estadoResultados[i].Concepto;
  }

  onClickDetalleSegundoNivel(i: number, value: number, name: string) {
    this.showResultados = false;
    this.showDetallePrimerNivel = false;
    this.showDetalleSegundoNivel = true;
    this.detalleNameSegundoNivel = name;
    this.detalleValueSegundoNivel = value;
    this.detalleConceptoSegundoNivel = 'Ventas...';
  }

  hideDetallePrimerNivel(): void {
    this.showResultados = true;
    this.showDetalleSegundoNivel = false;
    this.showDetallePrimerNivel = false;
  }

  hideDetalleSegundoNivel(): void {
    this.showResultados = false;
    this.showDetalleSegundoNivel = false;
    this.showDetallePrimerNivel = true;
  }
}
