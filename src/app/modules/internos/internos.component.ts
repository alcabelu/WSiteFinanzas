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
import { IDetalleUnidadesMensual } from './detalle-unidades-mensual';
import { IDetalleResultadosMensual } from './detalle-resultados-mensual';
import { IDetalleResultadosCuentas } from './detalle-resultados-cuentas';
import { ITipoUnidad } from './tipo-unidad';
import { IDetalleUnidadesAcumulado } from './detalle-unidades-acumulado';

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
  showDetalleUnidadesPrimerNivel = false;
  showDetallePrimerNivel = false;
  showDetalleSegundoNivel = false;
  showDetalleUnidadesSegundoNivel = false;
  isCollapsed = true;

  resultadoUnidadesService: IResultadoInternos[] = [];
  estadoResultados: IResultadoInternos[] = [];
  unidadesDepartamento: IResultadoInternos[] = [];
  efectivoSituacion: IEfectivoSituacion[];
  companias: ICompania[];
  sucursales: ISucursal[];
  departamentos: IDepartamento[] = [];
  tipoReporte: ITipoReporte[];
  detalleUnidadesMensual: IDetalleUnidadesMensual[];
  detalleUnidadesAcumulado: IDetalleUnidadesAcumulado[];
  detalleUnidadesTipo: ITipoUnidad[];
  detalleResultadosMensual: IDetalleResultadosMensual[];
  detalleResultadosCuentas: IDetalleResultadosCuentas[];
  resultadoUnidades: IResultadoInternos[] = [];
  selectedCompania = 0;
  selectedNombreCompania: string;
  selectedTipoReporte = 1;
  selectedSucursal = 'AA';
  selectedIndexSucursal = 0;
  selectedIdSucursal = -3; //El servicio SP_CONSULTA_SUCURSAL regresa varios valores, estamos usando IdSucursal y MSUC
  selectedIpSucursal = '';
  selectedConcentradora = '';
  selectedDepartamento = 'Todos';
  detalleResultadosMensualScroll = false;
  detalleResultadosCuentasScroll = false;
  mes: string;
  anio: string;
  periodo: string;
  //Control de sp SP_ESTADO_DE_RESULTADOS_DETALLE
  idDetalleResultados: number; // 1 = mensual, 2 = acumulado. Muestra la tabla de acumulado o mensual
  idEstadoResultado: number;
  idDetalleUnidades: number;

  detalleUnidadesConcepto: string;
  detalleUnidadesName: string;
  detalleUnidadesValue: number;
  detalleUnidadesConceptoSegundoNivel: string;
  detalleUnidadesNameSegundoNivel: string;
  detalleUnidadesValueSegundoNivel: string;
  detalleName: string;
  detalleValue: number;
  detalleConcepto: string;
  detalleNameSegundoNivel: string;
  detalleValueSegundoNivel: number;
  detalleConceptoSegundoNivel: string;

  valuesNegritas = [
    'Utilidad Bruta',
    'Utilidad Bruta Neta',
    'EBITDA',
    'Utilidad (Pérdida) de Operación',
    'RIF',
    'Utilidad (Pérdida) antes de Imp a la Utilidad',
    'Utilidad (Pérdida) Neta',
    'ROS',
    'Rotación CxC',
    'Rotación de Inventarios',
    'Rotación de CXP',
    'Neto'
  ];

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
      this.hideDetalles();
      this.showEfectivoSituacion = false;
      this.getResultadoUnidades();
      this.getEstadoResultados();
      this.getUnidadesDepartamento();

      //Actualizar info de breadcrumb
      const a = this.companias.find(x => x.ID == this.selectedCompania);
      this.selectedNombreCompania = a.NOMBRE;
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
      .subscribe(
        companias => { this.companias = companias; },
        error => this.errorMessage = <any>error);
  }

  getSucursales(): void {
    this._service.getSucursales({
      idTipoReporte: this.selectedTipoReporte,
      idAgencia: this.selectedCompania
    })
      .subscribe(
        sucursales => { this.sucursales = sucursales; },
        error => { this.errorMessage = <any>error },
        () => { this.onChangeSucursal(0); }
      );
  }

  getDepartamentos(): void {
    this._service.getDepartamentos({
      idReporte: this.selectedTipoReporte,
      idSucursal: this.selectedSucursal,
      idAgencia: this.selectedCompania,
      anio: this.anio,
      mes: this.mes
    })
      .subscribe(
        departamentos => { this.departamentos = departamentos; },
        error => this.errorMessage = <any>error,
        () => this.procesar()
      );
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

  getDetalleUnidadesMensual(concepto: string): void {
    this._service.getDetalleUnidadesMensual({
      idAgencia: this.selectedCompania,
      mSucursal: this.selectedSucursal,
      anio: this.anio,
      mes: this.mes,
      concepto: concepto
    })
      .subscribe(detalleUnidadesMensual => {
        this.detalleUnidadesMensual = detalleUnidadesMensual;
      },
      error => this.errorMessage = <any>error);
  }

  getDetalleUnidadesAcumulado(): void {
    // Se usa como parametro de departamento el texto de Concepto del primer nivel,
    // sin las letras N o S que se le agregan al inicio
    let concepto = this.detalleUnidadesConcepto;
    if (concepto.startsWith('N ')) concepto = concepto.substr(2);
    else if (concepto.startsWith('S ')) concepto = concepto.substr(2);

    //Limpiar tabla antes de consultar
    this.detalleUnidadesAcumulado = [];

    this._service.getDetalleUnidadesAcumulado({
      idAgencia: this.selectedCompania,
      mSucursal: this.selectedSucursal,
      anio: this.anio,
      mes: this.mes,
      departamento: concepto
    })
      .subscribe(detalleUnidadesAcumulado => {
        this.detalleUnidadesAcumulado = detalleUnidadesAcumulado;
      },
      error => this.errorMessage = <any>error);
  }

  getDetalleUnidadesTipo(carLine: string, tipoAuto: string = '', mes: string): void {
    // Se usa como parametro de departamento el texto de Concepto del primer nivel,
    // sin las letras N o S que se le agregan al inicio
    let concepto = this.detalleUnidadesConcepto;
    if (concepto.startsWith('N ')) concepto = concepto.substr(2);
    else if (concepto.startsWith('S ')) concepto = concepto.substr(2);

    this._service.getDetalleUnidadesTipo({
      idAgencia: this.selectedCompania,
      mSucursal: this.selectedSucursal,
      anio: this.anio,
      mes:  mes === '' ? this.mes : mes, //Cuando se manda a llamar desde acumulado (lado verde) contiene el parametro de mes
      departamento: concepto,
      carLine: carLine,
      tipoAuto: tipoAuto
    })
      .subscribe(detalleUnidadesTipo => {
        this.detalleUnidadesTipo = detalleUnidadesTipo;
      },
      error => this.errorMessage = <any>error);
  }

  getDetalleResultadosMensual(concepto: string): void {
    //Este servicio requiere el Id de la sucursal con un cero a la izquierda
    this._service.getDetalleResultadosMensual({
      idAgencia: this.selectedCompania,
      anio: this.anio,
      mes: this.mes,
      idSucursal: this.selectedIdSucursal >= 0 ? '0' + this.selectedIdSucursal.toString() : '00',
      mSucursal: this.selectedSucursal,
      departamento: this.selectedDepartamento,
      concepto: concepto,
      idEstadoDeResultado: this.idEstadoResultado,
      idDetalle: this.idDetalleResultados,
      idEstadoResultado: this.idEstadoResultado
    })
      .subscribe(detalleResultadosMensual => {
        this.detalleResultadosMensual = detalleResultadosMensual;
      },
      error => {
        this.errorMessage = <any>error;
        this.detalleResultadosMensual = [];
      },
      //Si la lista tiene más de 10 resultados se necesita ajustar
      //el ancho de tabla para que quepa el scroll
      () => {
        this.detalleResultadosMensualScroll = this.detalleResultadosMensual.length <= 10 ? true : false;
      }
    );
  }

  getDetalleResultadosCuentas(numCta: string, mes: string = ''): void {
    //Limpiar tabla antes de consultar
    this.detalleResultadosCuentas = [];

    this._service.getDetalleResultadosCuentas({
      servidorAgencia: this.selectedIpSucursal,
      concentradora: this.selectedConcentradora,
      anio: this.anio,
      mes:  mes === '' ? this.mes : mes, //Cuando se manda a llamar desde acumulado (lado verde) contiene el parametro de mes
      numCta: numCta
    })
      .subscribe(
        detalleResultadosCuentas => { this.detalleResultadosCuentas = detalleResultadosCuentas; },
        error => {
          this.errorMessage = <any>error;
          this.detalleResultadosCuentas = [];
        },
        //Si la lista tiene más de 10 resultados se necesita ajustar el ancho de tabla para que quepa el scroll
        () => {this.detalleResultadosCuentasScroll = this.detalleResultadosCuentas.length <= 10 ? true : false;}
      );
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

  //Revisa si la cadena debe ir en negrita
  shouldBeBold(value: string): boolean {
    return this.valuesNegritas.includes(value);
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

  onChangeCompania(newValue: number): void {
    this.selectedCompania = newValue;

    if (this.selectedCompania !== 0 && this.selectedTipoReporte) {
      //Llenar dropdown de sucursales
      this.getSucursales();
    }

    if (this.periodo && this.selectedCompania !== 0 && this.selectedSucursal) {
      this.getDepartamentos();
    }
  }

  onChangeSucursal(selectedIndex): void {
    const sucursal = this.sucursales[selectedIndex];
    this.selectedSucursal = sucursal.MSUC;
    this.selectedIdSucursal = sucursal.IdSucursal;
    this.selectedIpSucursal = sucursal.Servidor;
    this.selectedConcentradora = sucursal.Concentradora;

    if(this.periodo && this.selectedCompania !== 0 && this.selectedSucursal) {
      this.getDepartamentos();
    }
  }

  onChangeDepartamento(newValue): void {
    this.selectedDepartamento = newValue;
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

  onClickUnidades(i: number, value: number, name: string, idDetalleUnidades: number) {
    const concepto = this.resultadoUnidades[i].Concepto;

    if (concepto !== 'Total Unidades') {
      this.showDetalleUnidadesPrimerNivel = true;
      this.detalleUnidadesName = name;
      this.detalleUnidadesValue = value;
      this.detalleUnidadesConcepto = concepto;
      this.idDetalleUnidades = idDetalleUnidades;

      if (idDetalleUnidades === 1) { // Mensual
        this.getDetalleUnidadesMensual(concepto);
      }
      else if (idDetalleUnidades === 2) { // Acumulado
        this.getDetalleUnidadesAcumulado();
      }
    }
  }

  onClickDetalleUnidadesMensual(i: number, value: string, name: string, mes: string = '') {
    if (value.trim() !== 'Total') {
      this.showUnidades = false;
      this.showDetalleUnidadesPrimerNivel = false;
      this.showDetalleUnidadesSegundoNivel = true;
      this.detalleUnidadesNameSegundoNivel = name;
      this.detalleUnidadesValueSegundoNivel = value;

      if (mes === '') { //mensual
        this.detalleUnidadesConceptoSegundoNivel = this.detalleUnidadesMensual[i].CarLine;
        this.getDetalleUnidadesTipo(this.detalleUnidadesMensual[i].CarLine, '', mes);
      }
      else { //acumulado
        this.detalleUnidadesConceptoSegundoNivel = this.detalleUnidadesAcumulado[i].Carline + ' ' + name;
        this.getDetalleUnidadesTipo(this.detalleUnidadesAcumulado[i].Carline, '', mes);
      }
    }
  }

  onClickResultado(i: number, value: number, name: string, idEstadoResultado: number, idDetalleResultados: number) {
    this.showDetallePrimerNivel = true;
    this.detalleName = name;
    this.detalleValue = value;
    this.detalleConcepto = this.estadoResultados[i].Concepto;
    this.idDetalleResultados = idDetalleResultados;
    this.idEstadoResultado = idEstadoResultado
    this.getDetalleResultadosMensual(this.detalleConcepto);
  }

  onClickDetalleSegundoNivel(i: number, value: number, name: string, mes: string = '') {
    //validar que solo entre cuando viene de real (excluir Ppto y Variacion)
    if (this.detalleName === 'Real' || this.detalleName === 'AcReal') {
      //Etiqueta de mes usada en breadcrumb
      if (mes !== '') {
        this.detalleNameSegundoNivel = `(${name})`;
      }
      else {
        this.detalleNameSegundoNivel = '';
      }

      this.showResultados = false;
      this.showDetallePrimerNivel = false;
      this.showDetalleSegundoNivel = true;
      this.detalleValueSegundoNivel = value;
      this.detalleConceptoSegundoNivel = this.detalleResultadosMensual[i].Descr;
      this.getDetalleResultadosCuentas(this.detalleResultadosMensual[i].Numcta, mes);
    }
  }

  hideDetalles(): void {
    this.showResultados = true;
    this.showUnidades = true;
    this.showDetalleUnidadesPrimerNivel = false;
    this.showDetalleUnidadesSegundoNivel = false;
    this.showDetallePrimerNivel = false;
    this.showDetalleSegundoNivel = false;
  }

  hideDetalleUnidadesPrimerNivel(): void {
    this.showUnidades = true;
    this.showDetalleUnidadesSegundoNivel = false;
    this.showDetalleUnidadesPrimerNivel = false;
  }

  hideDetalleUnidadesSegundoNivel(): void {
    this.showUnidades = false;
    this.showDetalleUnidadesSegundoNivel = false;
    this.showDetalleUnidadesPrimerNivel = true;
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
