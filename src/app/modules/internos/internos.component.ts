import { Component, OnInit, ViewChild } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { TreeviewItem, TreeviewConfig, TreeviewModule } from 'ngx-treeview';
import { FormsModule, ReactiveFormsModule, NgModel } from '@angular/forms';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { trigger,
         style,
         transition,
         animate,
         keyframes,
         query,
         stagger,
         group,
         state,
         animateChild } from '@angular/animations';

import { ICompania } from '../../models/catalog/compania';
import { ITipoReporte } from '../../models/catalog/tipoReporte';
import { ISucursal } from '../../models/catalog/sucursal';
import { IDepartamento } from '../../models/catalog/departamento';

import { IAcumuladoReal } from '../../models/reports/acumuladoreal';
import { IAutoLineaAcumulado } from '../../models/reports/auto-linea-acumulado';
import { IDetalleResultadosCuentas } from '../../models/reports/detalle-resultados-cuentas';
import { IResultadoInternos } from '../../models/reports/resultado-internos';
import { IResultadoEstadoDeResultadosCalculo } from '../../models/reports/formulaEstadoResultado';
import { IDetalleResultadosMensual } from '../../models/reports/detalle-resultados-mensual';
import { IDetalleUnidadesAcumulado } from '../../models/reports/detalle-unidades-acumulado';
import { ITipoUnidad } from '../../models/reports/tipo-unidad';
import { IDetalleUnidadesMensual } from '../../models/reports/detalle-unidades-mensual';
import { ISeries } from '../../models/reports/series';



import { ColumnSortedEvent } from '../../shared/services/sort.service';
import { InternosService } from './internos.service';
import { FechaActualizacionService } from '../../shared';
import { FlujoeSituacionfComponent } from './flujoe-situacionf/flujoe-situacionf.component'
import { ElementSchemaRegistry } from '@angular/compiler';
//import { ENETUNREACH } from 'constants';

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

  constructor(private _service: InternosService, private _fechaActualizacionService: FechaActualizacionService) { }

  showFilters = true;
  showUnidades = true;
  showUnidadesAcumuladoPresupuesto = true;
  showUnidadesAcumuladoReal = 1;
  showUnidadesDeptoNivel = 1;
  showEstadoResultadoAcumuladoReal = 1;
  showResultados = true;
  showUnidadesDepartamento = true;
  showUnidadesDepartamentoAcumulado = true;
  showEstadoResultadoAcumuladoPresupuesto=true;  //DCG
  showUnidadesDepartamentoReal = true;
  showEfectivoSituacion = false;
  showAcumuladoReal = false;
  showAcumuladoPresupuesto = false;
  showReporteUnidades = true;
  showDetalleUnidadesPrimerNivel = false;
  showDetalleUnidadesSegundoNivel = false;
  showDetalleUnidadesTercerNivel = false;
  showDetallePrimerNivel = false;
  showDetalleSegundoNivel = false;
  showSumaDepartamentos = false;
  showSumaDepartamentosHeader=false;
  showSumaDepartamentosAReal=false;
  showPercents = true;
  resultadosSeriesArNv4: ISeries[] = [];
  isCollapsed = true;
  
  showOriginalUN=0; // para almacenar el nivel donde se esta posicion unidades
  showOriginalUD=0; // para almacenar el nivel donde se esta posicion unidades departamento
  showOriginal= 0;  // para almacenar el nivel donde se esta posicionado y poder ocultar estado de resultados

  resultadoUnidadesService: IResultadoInternos[] = [];
  estadoResultados: IResultadoInternos[] = [];
  estadoResultadosCalculo: IResultadoEstadoDeResultadosCalculo[] = [];
  estadoResultadosAcumuladoReal: IDetalleUnidadesAcumulado[] = [];
  sumaDepartamentosAReal: IDetalleUnidadesAcumulado[] = [];
  resultadoSumaDepartamentos: IResultadoInternos[] = [];
  unidadesDepartamento: IResultadoInternos[] = [];
  unidadesAcumuladoPresupuesto: IDetalleUnidadesAcumulado[] = [];
  unidadesAcumuladoPresupuestoDepartamento: IDetalleUnidadesAcumulado[] = [];
  acumuladoReal: IAcumuladoReal[] = [];
  acumuladoRealNv2: IAcumuladoReal[] = [];
  acumuladoRealDepartamento: IAcumuladoReal[] = [];
  acumuladoVariacion: IAcumuladoReal[] = [];
  autoLineaAcumulado: IAutoLineaAcumulado[] = [];
  tipoUnidadAcumulado: IAutoLineaAcumulado[] = [];
  companias: ICompania[];
  sucursales: ISucursal[];
  departamentos: IDepartamento[] = [];
  tipoReporte: ITipoReporte[];
  detalleUnidadesMensual: IDetalleUnidadesMensual[];
  detalleUnidadesAcumulado: IDetalleUnidadesAcumulado[];
  detalleUnidadesTipo: ITipoUnidad[];
  detalleUnidadesSeries: ISeries[];
  detalleResultadosMensual: IDetalleResultadosMensual[];
  detalleResultadosCuentas: IDetalleResultadosCuentas[];
  resultadoUnidades: IResultadoInternos[] = [];
  FlujoeSituacionfComponent: FlujoeSituacionfComponent;
  detalleUnidadesDepartamentoName = '';
  detalleUnidadesDepartamentoValue: number;
  idDetalleUnidadesDepartamento: number;
  detalleUnidadesDepartamentoConcepto = '';

  xmlDepartamento: any = [];
  xmlSend: any;

  selectedCompania = 0;
  selectedNombreCompania: string;
  selectedTipoReporte = 1;
  selectedIdSucursal = -2;
  selectedIdSucursalSecuencia = -1;
  selectedDepartamento = 'Todos';
  selectedIdDepartamento = 0;
  selectedIdDepartamentoEr = 0;
  selectedDepartamentos: string[] = [''];
  selectedDepartamentosStr: string; // Se formatean los departamentos como los necesita el sp
  idDepartamento: string; // Se guarda el departamento que aparece solo para flotillas segundo nivel
  detalleResultadosMensualScroll = false;
  detalleResultadosCuentasScroll = false;
  mes: string;
  departamentoAcumulado: string; // se usa en int-unidades-nv2 para guardar el mes selecccionado de la tabla acumulado
  mesAcumulado: string; // Se usa para ocultar los meses que no traen informacion en Unidades Segundo Nivel Acumulado
  mesAcumuladoNv3 = '';
  carLine: string;
  idReporte: string; // Se usa en unidades nv 4 para diferenciar real de acumulado
  anio: string;
  periodo: string;
  // Control de sp SP_ESTADO_DE_RESULTADOS_DETALLE
  idDetalleResultados: number; // 1 = mensual, 2 = acumulado. Muestra la tabla de acumulado o mensual
  idEstadoResultado: number;
  idDetalleUnidades: number;
  idAutoLinea: number;
  idOrigen: number;

  unidadesConcepto: string;
  detalleUnidadesConcepto: string;
  detalleUnidadesName: string;
  detalleUnidadesValue: number;
  detalleUnidadesConceptoSegundoNivel: string;
  detalleUnidadesAcumuladoRealCuartoNivel: string;
  detalleUnidadesNameSegundoNivel: string;
  detalleUnidadesValueSegundoNivel: string;
  detalleUnidadesConceptoTercerNivel: string;
  detalleUnidadesNameTercerNivel: string;
  detalleUnidadesValueTercerNivel: string;
  detalleName: string;
  detalleValue: number;
  detalleConcepto: string;
  detalleNameSegundoNivel: string;
  detalleValueSegundoNivel: number;
  detalleConceptoSegundoNivel: string;

  detalleUnidadesDepartamentoConceptoSegundoNivel: string;
  detalleUnidadesDepartamentoNameSegundoNivel: string;
  detalleUnidadesDepartamentoValueSegundoNivel: string;

  detalleUnidadesDepartamentoConceptoTercerNivel: string;

  valuesNegritas = [
    'Utilidad bruta',
    'Utilidad Bruta Neta',
    'EBITDA',
    'Utilidad (Pérdida) de Operación',
    'RIF',
    'Utilidad (Pérdida) antes de Imp a la Utilidad',
    'Utilidad (Pérdida) Neta',
    'ROS',
    'Rotación CxC',
    'Rotación x Pagar',
    'Ciclo Financiero',
    'Rotación Inventarios',
    'Rotación de CXP',
    'Neto'
  ];
  public activeSpinner: boolean = false;

  ngOnInit() {
    this.setDefaultDate();
    //TextTrackCueList
    this.setTipoReporte();
    this.getCompanias();
    this.getEstadoDeResultadosCalculo();   
    //this.disabledSumaDepartamentos();
  }

  toggleFilters(): void {
     this.showFilters = !this.showFilters;
  }

  toggleUnidades(): void {
        
    if (this.showUnidades === true || this.showDetalleUnidadesPrimerNivel === true || this.showDetalleUnidadesSegundoNivel===true 
      ||  this.showDetalleUnidadesTercerNivel ===true){
       this.showOriginalUN = 0;
        if (this.showDetalleUnidadesTercerNivel === true){
          this.showOriginalUN = 3;
          this.showDetalleUnidadesTercerNivel = false;
        }
        if (this.showDetalleUnidadesSegundoNivel === true){
            this.showOriginalUN = 2;
            this.showDetalleUnidadesSegundoNivel = false;
        }
        if (this.showDetalleUnidadesPrimerNivel === true){
          this.showOriginalUN = 1;
          this.showDetalleUnidadesPrimerNivel = false;
      }
      if (this.showUnidades) {this.showUnidades= !this.showUnidades};
    }else{
      if (this.showUnidades === false && this.showOriginalUN === 0 ){
        this.showUnidades = !this.showUnidades;
      }
      if( this.showOriginalUN === 1){this.showDetalleUnidadesPrimerNivel = true;}
      if( this.showOriginalUN === 2){this.showDetalleUnidadesSegundoNivel = true;}
      if( this.showOriginalUN === 3){this.showDetalleUnidadesTercerNivel = true;}
      this.showOriginalUN = 0;
      }
  }

  toggleUnidadesAcumuladoPresupuesto() {
    this.showUnidadesAcumuladoPresupuesto = !this.showUnidadesAcumuladoPresupuesto;
  }

  toggleUnidadesAcumuladoReal() {
    if (this.showUnidadesAcumuladoReal>0){
      this.showOriginal= this.showUnidadesAcumuladoReal;
      this.showUnidadesAcumuladoReal=0;
    }
      else{   
        this.showUnidadesAcumuladoReal= this.showOriginal;
        this.showOriginal=0;
    }
   // this.showOriginal= this.showUnidadesAcumuladoReal;
   // this.showUnidadesAcumuladoReal = this.showUnidadesAcumuladoReal === 1 ? 0 : 1;
  }

//estado de resultados
  toggleResultados(): void {
   var tr = this.selectedTipoReporte.toString();
   switch (tr)
   {
     case '1': {
        //mensual         
        if(this.showResultados===true || this.showDetallePrimerNivel===true ||this.showDetalleSegundoNivel===true ){
          if (this.showDetalleSegundoNivel==true){
           // this.showDetallePrimerNivel=false;
            this.showDetalleSegundoNivel=false;
            this.showOriginal=2;
          }
          if (this.showDetallePrimerNivel===true){
            this.showDetallePrimerNivel=false;
            this.showOriginal=1;
          }
          if ( this.showOriginal===0){
             this.showResultados=!this.showResultados;
          }
          
       }else{
          if (this.showOriginal===0){
            this.showResultados=!this.showResultados;
          }
          if(this.showOriginal===1){           
            this.showDetallePrimerNivel=true;
          }
          if(this.showOriginal===2){
           // this.showDetallePrimerNivel=true;
            this.showDetalleSegundoNivel=true;
          }
          //this.showResultados=true;
          this.showOriginal=0;
        }
       
      break;
      }
     case '2':{
        //Acumulado real
        if(this.showOriginal===0){
            if(this.showEstadoResultadoAcumuladoReal===1){
              this.showOriginal=1;
            }
            if(this.showEstadoResultadoAcumuladoReal===2){
              this.showOriginal=2;
            }
            this.showEstadoResultadoAcumuladoReal= 0;
        }else{
          if(this.showOriginal===1){
            this.showEstadoResultadoAcumuladoReal=1;
          }
          if(this.showOriginal===2){
            this.showEstadoResultadoAcumuladoReal=2;
          }
          this.showOriginal=0;
        }
        break;
      }
     case '3':{
        //Acumulado presupuesto 
        this.showEstadoResultadoAcumuladoPresupuesto = !this.showEstadoResultadoAcumuladoPresupuesto;          
        break;
      }
   }
   
  }

//UNIDADES 2
  toggleUnidadesDepartamento(): void {

    if(this.showUnidadesDepartamento==true){
      this.showOriginalUD = this. showUnidadesDeptoNivel;
      if (this. showUnidadesDeptoNivel==4){
          this.showUnidadesDeptoByLevel(3);
      }
    }else{
      this.showUnidadesDeptoNivel=this.showOriginalUD;
      this.showOriginalUD=0;
    }
    this.showUnidadesDepartamento = !this.showUnidadesDepartamento;
  }

  toggleUnidadesDepartamentoAcumulado(): void {
    this.showUnidadesDepartamentoAcumulado = !this.showUnidadesDepartamentoAcumulado;
  }

  toggleUnidadesDepartamentoReal(): void {
    this.showUnidadesDepartamentoReal = !this.showUnidadesDepartamentoReal;
  }

  togglePercents() {
    this.showPercents = !this.showPercents;
  }

  disabledSumaDepartamentos(): boolean {
    const sTipoReporte = this.selectedTipoReporte.toString();
    const sCompania = this.selectedCompania.toString();
    if (sCompania === '0' || (sTipoReporte === '4' || sTipoReporte === '5')) {
      return true;
    } else {
      return false;
    }
  }
  
  disabledButtonPorcentaje() : boolean {
    const sTipoReporte = this.selectedTipoReporte.toString();
    const sCompania = this.selectedCompania.toString();
    if (sCompania === '0' || (sTipoReporte === '4' || sTipoReporte === '5')) {
      return true;
    } else {
      return false;
    }
  }

  disabledSucursalDepartamento(): boolean {
    const sTipoReporte = this.selectedTipoReporte.toString();
    if  (this.selectedCompania==0 || (sTipoReporte === '4' || sTipoReporte === '5')) {
      return true;
    } else {
      return false;
    }
  }

  procesar(): void {
    if (this.showSumaDepartamentos== true){
      return;
    }
    if(!this.activeSpinner){
      this.controlarSpinner(true);
    }
    
    const sTipoReporte = this.selectedTipoReporte.toString(); // Aunque se definio como number, la comparacion siempre lo toma como string
    const sCompania = this.selectedCompania.toString();

    if ((sTipoReporte === '4' || sTipoReporte === '5') && sCompania !== '0') {
      this.showReporteUnidades = false;
      this.showEfectivoSituacion = true;
      this.showAcumuladoReal = false;
      this.showAcumuladoPresupuesto = false;
      this.showAcumuladoReal = false;
      this.controlarSpinner(false);
      //this.FlujoeSituacionfComponent.getEfectivoSituacion();
    } else if (sTipoReporte === '2' && sCompania !== '0') { // Acumulado real
      this.showReporteUnidades = false;
      this.showEfectivoSituacion = false;
      this.showAcumuladoReal = true;
      this.showAcumuladoPresupuesto = false;
      this.showUnidadesAcumuladoReal = 1;
      this.showEstadoResultadoAcumuladoReal = 1;
      this.getAcumuladoReal();
      this.getUnidadesAcumuladoRealDepartamento();
      this.getEstadoResultadosAcumuladoReal();
    } else if (sTipoReporte === '3' && sCompania !== '0') { // Acumulado presupuesto
      this.showReporteUnidades = false;
      this.showEfectivoSituacion = false;
      this.showAcumuladoReal = false;
      this.showAcumuladoPresupuesto = true;
      this.getUnidadesAcumuladoPresupuesto();
      this.getUnidadesAcumuladoPresupuestoDepartamento();
      this.getResultadosPresupuesto();
    } else if (sCompania !== '0') {
      this.showUnidadesInit();

      // Actualizar info de breadcrumb
      const a = this.companias.find(x => x.id === +this.selectedCompania);
      this.selectedNombreCompania = a.nombreComercial;
    }
  }

private changeCursorWait(): void {
  document.body.style.cursor='wait';
}

private changeCursorDefault(): void {
  document.body.style.cursor='default';
}


  private showUnidadesInit(): void {
   if (this.showSumaDepartamentos === false){
      this.showOriginal=0;
      this.showOriginalUD=0;
      this.showOriginalUN=0;
   }
    this.hideDetalles();
    this.showReporteUnidades = true;
    this.showEfectivoSituacion = false;
    this.showSumaDepartamentos = false;
    this.showEfectivoSituacion = false;
    this.showAcumuladoReal = false;
    this.showAcumuladoPresupuesto = false;
    
    if(this.selectedCompania!=0){  // solo se ejecutan cuando seseleciona una empresa del catalogo
      this.getResultadoUnidades();
      this.getEstadoResultados();
      this.getUnidadesDepartamento();
    }
    delete(this.resultadoSumaDepartamentos);
    delete (this.sumaDepartamentosAReal);
  }
//////
  sumaDepartamentos(): void {
    if (this.selectedDepartamentosStr && this.selectedDepartamentosStr !== '\'') {
      this.getSumaDepartamentos();

    }
  }
//////////
  showSuma(): void {
    const usuario = JSON.parse(localStorage.getItem('userLogged'));
    this._service.getDepartamentos({
       idCompania: this.selectedCompania,
       idSucursal: this.selectedIdSucursal,
       idUsuario: usuario.id
    })
    .subscribe( departamentos => {
      this.departamentos = departamentos;
    },
    error => this.errorMessage = <any>error
    );
   delete(this.resultadoUnidades);

    var tipoReporte= this.selectedTipoReporte.toString();
    switch (tipoReporte){
      case '1':
        this.showSumaDepartamentos = true;
        this.showSumaDepartamentosHeader=true;
        this.showSumaDepartamentosAReal=false;
        this.showAcumuladoPresupuesto= false;
        this.showResultados= false;
        this.showAcumuladoReal= false;
        this.showReporteUnidades = false;
        break;
      default :
        this.showSumaDepartamentos = true;
        this.showSumaDepartamentosHeader=false;
        this.showSumaDepartamentosAReal=true;
        this.showAcumuladoPresupuesto= false;
        this.showResultados= false;
        this.showAcumuladoReal= false;
        this.showReporteUnidades = false;
        break;
    }
  }

  hideSumaDepartamentos(): void {
    this.showUnidadesInit();
    // TODO: reiniciar objeto de suma
  }

  getResultadoUnidades(): void {
    this._service.getUnidades({
      idCompania: this.selectedIdSucursal > 0 ?  0 : this.selectedCompania,
      idSucursal: this.selectedIdSucursal > 0 ? this.selectedIdSucursal : 0,
      periodoYear: this.anio,
      periodoMes: this.mes
    })
      .subscribe(resultadoUnidades => {
        this.resultadoUnidades = resultadoUnidades;
      },
      error => this.errorMessage = <any>error,
      () => {
        const total = this.resultadoUnidades.find(x => x.idOrigen === 0);
        const totalCantidad = total.cantidad;
        const totalPresupuesto = total.cantidadPresupuesto;
        const totalCantidadAcumulado = total.cantidadAcumulado;
        const totalPresupuestoAcumulado = total.cantidadPresupuestoAcumulado;

        this.resultadoUnidades.forEach(ru => {
          // Calcula porcentajes de cantidad real y presupuesto (mensual y acumulado)
          if (ru.descripcion.trim() === 'Intercambios') {
            // Intercambios no se toma en cuenta
            ru.porcentaje = 0;
            ru.presupuestoPorcentaje = 0;
            ru.porcentajeAcumulado = 0;
            ru.presupuestoPorcentajeAcumulado = 0;
          } else {
            ru.porcentaje = ru.cantidad / totalCantidad * 100;
            ru.presupuestoPorcentaje = ru.cantidadPresupuesto / totalPresupuesto * 100;
            ru.porcentajeAcumulado = ru.cantidadAcumulado / totalCantidadAcumulado * 100;
            ru.presupuestoPorcentajeAcumulado = ru.cantidadPresupuestoAcumulado / totalPresupuestoAcumulado * 100;
          }

          // Calcula porcentaje de variacion
          if (ru.cantidadPresupuesto === 0) {
            // Evitar division entre cero
            ru.porcentajeVariacion = 100;
          } else {
            ru.porcentajeVariacion = ru.porcentaje - ru.presupuestoPorcentaje;
          }

          // Calcula porcentaje de variacion acumulado
          if (ru.cantidadPresupuestoAcumulado === 0) {
            // Evitar division entre cero
            ru.porcentajeVariacionAcumulado = 100;
          } else {
            ru.porcentajeVariacionAcumulado = ru.porcentajeAcumulado - ru.presupuestoPorcentajeAcumulado;
          }
        });
      }
    );
  }

  calculaTotalMensual(items, prop) {
    return items.reduce(function (a, b) {
      return a + b[prop];
    }, 0);
  }
  
  getEstadoDeResultadosCalculo(): void  {
    this._service.getEstadoDeResultadosCalculo({
      periodoYear: this.anio,
      periodoMes: this.mes,
    }).subscribe(estadoResultadosCalculo => {
        this.estadoResultadosCalculo = estadoResultadosCalculo;
      },
      error => { this.errorMessage = <any>error; }
    );
  }

  getEstadoResultados(): void { 
    this._service.getEstadoResultados({
      idCompania: this.selectedCompania,
      idSucursal: this.selectedIdSucursal,// > 0 ? this.selectedIdSucursal : 0, TMC se cambia ya que ahy valores menores a cero
      periodoYear: this.anio,
      periodoMes: this.mes,
      idDepartamento: this.selectedIdDepartamentoEr,
      idSucursalSecuencia: this.selectedIdSucursalSecuencia
    })
      .subscribe(estadoResultados => {
        this.estadoResultados = estadoResultados;
        this.controlarSpinner(false);
      },
      error => { this.errorMessage = <any>error; },
      () => {

        const ventas = this.estadoResultados.find(x => x.idEstadoResultadosI === 54);
        const utilidadBrutaNeta = this.estadoResultados.find(x => x.descripcion === 'Utilidad Bruta Neta');

        this.estadoResultados.forEach(er => {

          this.getCalculoER(er, this.estadoResultados);
         
          ventas.cantidad = this.getIsNumber(ventas.cantidad) //ventas.cantidad >= 0 ? ventas.cantidad : 0;
          ventas.cantidadAcumulado = this.getIsNumber(ventas.cantidadAcumulado);// ventas.cantidadAcumulado >= 0 ? ventas.cantidadAcumulado : 0;
          ventas.cantidadPresupuesto= this.getIsNumber(ventas.cantidadPresupuesto);//ventas.cantidadPresupuesto >= 0 ? ventas.cantidadPresupuesto : 0;
          ventas.cantidadPresupuestoAcumulado = this.getIsNumber(ventas.cantidadPresupuestoAcumulado);//ventas.cantidadPresupuestoAcumulado >= 0 ? ventas.cantidadPresupuestoAcumulado : 0;

          utilidadBrutaNeta.cantidad = this.getIsNumber(utilidadBrutaNeta.cantidad);//utilidadBrutaNeta.cantidad >= 0  ? utilidadBrutaNeta.cantidad : 0;
          utilidadBrutaNeta.cantidadPresupuesto = this.getIsNumber(utilidadBrutaNeta.cantidadPresupuesto);//utilidadBrutaNeta.cantidadPresupuesto >= 0 ? utilidadBrutaNeta.cantidadPresupuesto : 0;
          utilidadBrutaNeta.cantidadAcumulado = this.getIsNumber(utilidadBrutaNeta.cantidadAcumulado);//utilidadBrutaNeta.cantidadAcumulado >= 0 ? utilidadBrutaNeta.cantidadAcumulado : 0;
          utilidadBrutaNeta.cantidadPresupuestoAcumulado = this.getIsNumber(utilidadBrutaNeta.cantidadPresupuestoAcumulado);//utilidadBrutaNeta.cantidadPresupuestoAcumulado >= 0 ? utilidadBrutaNeta.cantidadPresupuestoAcumulado : 0;
          
          er.cantidad = this.getIsNumber(er.cantidad);//er.cantidad >= 0 ? er.cantidad :0;
          er.cantidadAcumulado = this.getIsNumber(er.cantidadAcumulado);//er.cantidadAcumulado >= 0 ? er.cantidadAcumulado: 0;
          er.cantidadPresupuesto = this.getIsNumber(er.cantidadPresupuesto);//er.cantidadPresupuesto >= 0 ? er.cantidadPresupuesto : 0;          
          er.cantidadPresupuestoAcumulado = this.getIsNumber(er.cantidadPresupuestoAcumulado);//er.cantidadPresupuestoAcumulado >= 0 ? er.cantidadPresupuestoAcumulado : 0;

          // Calcula porcentaje real
          switch (er.idEstadoResultadosI) {
            case 54: { // ventas
              er.porcentaje = 100;
              er.porcentajeAcumulado = 100;
              er.presupuestoPorcentaje = 100;
              er.presupuestoPorcentajeAcumulado = 100;
              break;
            }
            case 8: { // Costo de ventas
              er.porcentaje = this.getIsNumber(er.cantidad / ventas.cantidad * 100);
              er.porcentajeAcumulado = this.getIsNumber(er.cantidadAcumulado / ventas.cantidadAcumulado * 100);
              er.presupuestoPorcentaje = this.getIsNumber(er.cantidadPresupuesto / ventas.cantidadPresupuesto * 100);
              er.presupuestoPorcentajeAcumulado = this.getIsNumber(er.cantidadPresupuestoAcumulado / ventas.cantidadPresupuestoAcumulado * 100);
              break;
            }
            case 40: { // Otros costos
              er.porcentaje = this.getIsNumber(er.cantidad / ventas.cantidad * 100);
              er.porcentajeAcumulado = this.getIsNumber(er.cantidadAcumulado / ventas.cantidadAcumulado * 100);
              er.presupuestoPorcentaje = this.getIsNumber(er.cantidadPresupuesto / ventas.cantidadPresupuesto * 100);
              er.presupuestoPorcentajeAcumulado = this.getIsNumber(er.cantidadPresupuestoAcumulado / ventas.cantidadPresupuestoAcumulado * 100);
              break;
            }
            default: { // todos los demás van por utilidad bruta neta
              er.porcentaje = this.getIsNumber(er.cantidad / utilidadBrutaNeta.cantidad * 100);
              er.porcentajeAcumulado = this.getIsNumber(er.cantidadAcumulado / utilidadBrutaNeta.cantidadAcumulado * 100);
              er.presupuestoPorcentaje = this.getIsNumber(er.cantidadPresupuesto / utilidadBrutaNeta.cantidadPresupuesto * 100);
              er.presupuestoPorcentajeAcumulado = this.getIsNumber(er.cantidadPresupuestoAcumulado / utilidadBrutaNeta.cantidadPresupuestoAcumulado * 100);
              break;
            }
          }

          switch (er.descripcion) {
            case 'Utilidad bruta': {
              er.porcentaje = this.getIsNumber(er.cantidad / ventas.cantidad * 100);
              er.porcentajeAcumulado = this.getIsNumber(er.cantidadAcumulado / ventas.cantidadAcumulado * 100);
              er.presupuestoPorcentaje = this.getIsNumber(er.cantidadPresupuesto / ventas.cantidadPresupuesto * 100);
              er.presupuestoPorcentajeAcumulado = this.getIsNumber(er.cantidadPresupuestoAcumulado / ventas.cantidadPresupuestoAcumulado * 100);
              break;
            }
            case 'Utilidad Bruta Neta': {
              er.porcentaje = this.getIsNumber(er.cantidad / ventas.cantidad * 100);
              er.porcentajeAcumulado = this.getIsNumber(er.cantidadAcumulado / ventas.cantidadAcumulado * 100);
              er.presupuestoPorcentaje = this.getIsNumber(er.cantidadPresupuesto / ventas.cantidadPresupuesto * 100);
              er.presupuestoPorcentajeAcumulado = this.getIsNumber(er.cantidadPresupuestoAcumulado / ventas.cantidadPresupuestoAcumulado * 100);
              break;
            }
          }

          // Calcula la variacion
          er.variacion = this.getIsNumber(er.cantidad - er.cantidadPresupuesto);
          er.variacionAcumulado = this.getIsNumber(er.cantidadAcumulado - er.cantidadPresupuestoAcumulado);

          // Calcula porcentaje de variacion
          if (er.cantidadPresupuesto === 0) {
            // Evitar division entre cero
            er.porcentajeVariacion = 100;
          } else {
            er.porcentajeVariacion = this.getIsNumber(er.porcentaje - er.presupuestoPorcentaje);
          }

          // Calcula porcentaje de variacion acumulado
          if (er.cantidadPresupuestoAcumulado === 0) {
            // Evitar division entre cero
            er.porcentajeVariacionAcumulado = 100;
          } else {
            er.porcentajeVariacionAcumulado = this.getIsNumber(er.porcentajeAcumulado - er.presupuestoPorcentajeAcumulado);
          }
        });
      }
    );
  }

  getIsNumber(value: number ): number {
    //if(isNaN(parseFloat(value.toString())))
    if (isNaN(value) || 
        value.toString() === "-Infinity" || 
        value.toString() === "Infinity" ||
        value.toString() ==="-∞" ||
        value.toString() ==="∞")
      return 0;
      else  
      return parseFloat(value.toString());
  }

  getCalculoER (er : IResultadoInternos, ResultadoCalculo : IResultadoInternos[]): void{
    try{
      const calc  = this.estadoResultadosCalculo.find(x=>x.idOrden == er.idOrden);
      if(calc != null) {
        var formulaOriginal = calc.formula;
        var formulaOriginalAcumulado = calc.formula;
        var formulaOriginalPresupuesto = calc.formula;
        var formulaOriginalPresupuestoAcumulado = calc.formula;
  
        let div = /\//gi;
        let mul = /\*/gi;
        let sum = /\+/gi;
        let res = /\-/gi;
        let parlef = /\(/gi;
        let parig = /\)/gi;
        var formulaSinOperador = calc.formula.replace(div,"operado")
                                             .replace(mul,"operado")
                                             .replace(sum,"operado")
                                             .replace(res,"operado")
                                             .replace(parlef,"operado")
                                             .replace(parig,"operado")
                                             //.replace("1.16","");
        
  
        formulaSinOperador.split('operado').forEach(erc=>{
          if(erc.indexOf("idOrden") != -1){
                     
            var val =ResultadoCalculo.find(x=>x.idOrden === +erc.replace("idOrden",""));
            val.cantidad = this.getIsNumber(val.cantidad); //val.cantidad >= 0 ? val.cantidad : 0;
            val.cantidadAcumulado = this.getIsNumber(val.cantidadAcumulado); //val.cantidadAcumulado >= 0 ? val.cantidadAcumulado: 0;
            val.cantidadPresupuesto = this.getIsNumber(val.cantidadPresupuesto); //val.cantidadPresupuesto >= 0 ? val.cantidadPresupuesto : 0;
            val.cantidadPresupuestoAcumulado = this.getIsNumber(val.cantidadPresupuestoAcumulado); //val.cantidadPresupuestoAcumulado >= 0 ? val.cantidadPresupuestoAcumulado : 0;
  
            formulaOriginal =formulaOriginal.replace(erc, String(val.cantidad)).replace("diaMes",String(calc.numDiaMensual));
            formulaOriginalAcumulado =formulaOriginalAcumulado.replace(erc, String(val.cantidadAcumulado)).replace("diaMes",String(calc.numDiaAcumulado));
            formulaOriginalPresupuesto = formulaOriginalPresupuesto.replace(erc, String(val.cantidadPresupuesto)).replace("diaMes",String(calc.numDiaMensual));;
            formulaOriginalPresupuestoAcumulado = formulaOriginalPresupuestoAcumulado.replace(erc, String(val.cantidadPresupuestoAcumulado)).replace("diaMes",String(calc.numDiaAcumulado));
          }
        });
        var er = ResultadoCalculo.find(x=>x.idOrden === er.idOrden);
        er.cantidad = this.getIsNumber((eval(formulaOriginal)).toFixed(3)); // (eval(formulaOriginal)).toFixed(3) >= 0 ? (eval(formulaOriginal)).toFixed(3) : 0;
        er.cantidadAcumulado = this.getIsNumber(eval(formulaOriginalAcumulado).toFixed(3)); //eval(formulaOriginalAcumulado).toFixed(3) >= 0?eval(formulaOriginalAcumulado).toFixed(3):0;
        if (er.idOrden == 23) {

          er.cantidadPresupuesto = this.getIsNumber((eval(formulaOriginalPresupuesto)).toFixed(3)); //(eval(formulaOriginalPresupuesto)).toFixed(3) >= 0? (eval(formulaOriginalPresupuesto)).toFixed(3) : 0;
          er.cantidadPresupuestoAcumulado = this.getIsNumber(eval(formulaOriginalPresupuestoAcumulado).toFixed(3)); //eval(formulaOriginalPresupuestoAcumulado).toFixed(3) >= 0? eval(formulaOriginalPresupuestoAcumulado).toFixed(3) : 0;
        
        }
      }
    }catch(e) {
        console.log(e);
    }
  }

  ///////////

  getEstadoResultadosAcumuladoReal(): void {
    this._service.getEstadoResultadosAcumuladoReal({
      idCompania: this.selectedCompania, //this.selectedIdSucursal > 0 ?  0 : this.selectedCompania, TMC Se envia siempre la sucursal
      idSucursal: this.selectedIdSucursal > 0 ? this.selectedIdSucursal : 0,
      periodoYear: this.anio,
      idDepartamento: this.selectedIdDepartamento,
      idSucursalSecuencia: this.selectedIdSucursalSecuencia
    })
      .subscribe(estadoResultadosAcumuladoReal => {
        this.estadoResultadosAcumuladoReal = estadoResultadosAcumuladoReal;
        this.controlarSpinner(false);
      },
      error => { this.errorMessage = <any>error; },
      () => {
        // Ciclo de 12 meses
        for (let mes = 1; mes <= 12; mes++) {
          const nombreMes = this.toLongMonth(mes.toString());
          const ventas = this.estadoResultadosAcumuladoReal.find(x => x.descripcion === 'Ventas');
          const utilidadBrutaNeta = this.estadoResultadosAcumuladoReal.find(x => x.descripcion === 'Utilidad Bruta Neta');

          // Se calculan porcentajes del mes correspondiente
          this.estadoResultadosAcumuladoReal.forEach(er => {
             er.totalAnual=er['enero'] +er['febrero'] + er['marzo']+er['abril'] + er['mayo'] + er['junio'] + er['julio'] + er['agosto']
          + er['septiembre']+ er['octubre']+ er['noviembre']+ er['diciembre'];
            switch (er.descripcion) {
              case 'Ventas': {
                er[nombreMes + 'Perc'] = 100;
                break;
              }
              case 'Utilidad bruta': {
                er[nombreMes + 'Perc'] = er[nombreMes] / ventas[nombreMes] * 100;
                break;
              }
              case 'Utilidad Bruta Neta': {
                er[nombreMes + 'Perc'] = er[nombreMes] / ventas[nombreMes] * 100;
                break;
              }
              case 'Costo de Ventas': {
                er[nombreMes + 'Perc'] = er[nombreMes] / ventas[nombreMes] * 100;
                break;
              }
              case 'Otros Costos': {
                er[nombreMes + 'Perc'] = er[nombreMes] / ventas[nombreMes] * 100;
                break;
              }
              default: {
                er[nombreMes + 'Perc'] = er[nombreMes] / utilidadBrutaNeta[nombreMes] * 100;
                break;
              }
            }
          });
        }
      }
    );
  }

getSumaDepartamentosAcumuladoReal(): void {
  this._service.getSumaDepartamentosAcumuladoReal({
    idCompania: this.selectedCompania,
    idSucursal: this.selectedIdSucursal,// > 0 ? this.selectedIdSucursal : 0, TMC se cambia ya que ahy valores menores a cero
    periodoYear: this.anio,
    periodoMes: this.mes,
    xmlDepartamento : this.xmlSend,
    idSucursalSecuencia: this.selectedIdSucursalSecuencia,
    tipoReporte: this.selectedTipoReporte
  })
    .subscribe(sumaDepartamentos => {
      this.sumaDepartamentosAReal = sumaDepartamentos;
    },
    error => { this.errorMessage = <any>error; },
    () => {
      var totalAnual=0;
      // Ciclo de 12 meses
      for (let mes = 1; mes <= 12; mes++) {
        const nombreMes = this.toLongMonth(mes.toString());
        const ventas = this.sumaDepartamentosAReal.find(x => x.descripcion === 'Ventas');
        const utilidadBrutaNeta = this.sumaDepartamentosAReal.find(x => x.descripcion === 'Utilidad Bruta Neta');
        //this.sumaDepartamentosAReal[totalAnual] =  this.sumaDepartamentosAReal[totalAnual] + ventas[nombreMes];
        // Se calculan porcentajes del mes correspondiente
        this.sumaDepartamentosAReal.forEach(er => {
          er.totalAnual=er['enero'] +er['febrero'] + er['marzo']+er['abril'] + er['mayo'] + er['junio'] + er['julio'] + er['agosto']
          + er['septiembre']+ er['octubre']+ er['noviembre']+ er['diciembre'];
          switch (er.descripcion) {
            case 'Ventas': {
              er[nombreMes + 'Perc'] = 100;
              break;
            }
            case 'Utilidad bruta': {
              er[nombreMes + 'Perc'] = er[nombreMes] / ventas[nombreMes] * 100;
              break;
            }
            case 'Utilidad Bruta Neta': {
              er[nombreMes + 'Perc'] = er[nombreMes] / ventas[nombreMes] * 100;
              break;
            }
            case 'Costo de Ventas': {
              er[nombreMes + 'Perc'] = er[nombreMes] / ventas[nombreMes] * 100;
              break;
            }
            case 'Otros Costos': {
              er[nombreMes + 'Perc'] = er[nombreMes] / ventas[nombreMes] * 100;
              break;
            }
            default: {
              er[nombreMes + 'Perc'] = er[nombreMes] / utilidadBrutaNeta[nombreMes] * 100;
              break;
            }
          }
        });
      }
    }
  );
}

  onClickUnidadesAcumuladoRealNv3(UnidadDescripcion: string) {
    this.detalleUnidadesAcumuladoRealCuartoNivel = UnidadDescripcion;
    this.showUnidadesAcumuladoReal = 4;
    this.getDetalleUnidadesSeriesArNv4(UnidadDescripcion);
  }

  getDetalleUnidadesSeriesArNv4(UnidadDescripcion): void {
     this._service.getDetalleUnidadesSeriesAr({
      idCompania:         this.selectedIdSucursal > 0 ? 0 : this.selectedCompania,
      idSucursal:         this.selectedIdSucursal > 0 ? this.selectedIdSucursal : 0,
      idOrigen:           this.idOrigen,
      periodoYear:        this.anio,
      periodoMes:         this.mes,
      unidadDescripcion:  UnidadDescripcion
    })
    .subscribe(resultadosSeriesArNv4 => {
      this.resultadosSeriesArNv4 = resultadosSeriesArNv4;
    },
    error => this.errorMessage = <any>error);
  }
/*
  getSumaDepartamentos(): void {
    this._service.getSumaDepartamentos({
      idCia: this.selectedCompania,
      idSucursal: this.selectedIdSucursal,
     // departamento: this.selectedDepartamentosStr,
      xmlDepartamento : this.xmlSend,      
      mes: this.mes,
      anio: this.anio,
      idSucursalSecuencia : this.selectedIdSucursalSecuencia
    })
   .subscribe(sumaDepartamentos => {
     console.log("Resultado: ",sumaDepartamentos);
        this.resultadoSumaDepartamentos = sumaDepartamentos;
      },
       error => this.errorMessage = <any>error);
      // () =>{
    } 
      
*///

////////
getSumaDepartamentos(): void { 

  var sTipoReporte= this.selectedTipoReporte.toString();
switch(sTipoReporte){
    case '1':
       this.getReporteSumaDepartamentos();
    break;
    default:
      this.getSumaDepartamentosAcumuladoReal();
    break;
  }
}

getReporteSumaDepartamentos() : void{
  this._service.getSumaDepartamentos({
    idCompania: this.selectedCompania,
    idSucursal: this.selectedIdSucursal,// > 0 ? this.selectedIdSucursal : 0, TMC se cambia ya que ahy valores menores a cero
    periodoYear: this.anio,
    periodoMes: this.mes,
    xmlDepartamento : this.xmlSend,
    idSucursalSecuencia: this.selectedIdSucursalSecuencia,
    tipoReporte: this.selectedTipoReporte
  })
    .subscribe(sumaDepartamentos => {
      this.resultadoSumaDepartamentos = sumaDepartamentos;
    },
    error => { this.errorMessage = <any>error; },
    () => {

      const ventas = this.resultadoSumaDepartamentos.find(x => x.idEstadoResultadosI === 54);
      const utilidadBrutaNeta = this.resultadoSumaDepartamentos.find(x => x.descripcion === 'Utilidad Bruta Neta');

      this.resultadoSumaDepartamentos.forEach(er => {
        this.getCalculoER(er, this.resultadoSumaDepartamentos);
        // Calcula porcentaje real
        switch (er.idEstadoResultadosI) {
          case 54: { // ventas
            er.porcentaje = 100;
            er.porcentajeAcumulado = 100;
            er.presupuestoPorcentaje = 100;
            er.presupuestoPorcentajeAcumulado = 100;
            break;
          }
          case 8: { // Costo de ventas
            er.porcentaje = this.getIsNumber(er.cantidad / ventas.cantidad * 100);
            er.porcentajeAcumulado = this.getIsNumber(er.cantidadAcumulado / ventas.cantidadAcumulado * 100);
            er.presupuestoPorcentaje = this.getIsNumber(er.cantidadPresupuesto / ventas.cantidadPresupuesto * 100);
            er.presupuestoPorcentajeAcumulado = this.getIsNumber(er.cantidadPresupuestoAcumulado / ventas.cantidadPresupuestoAcumulado * 100);
            break;
          }
          case 40: { // Otros costos
            er.porcentaje = this.getIsNumber(er.cantidad / ventas.cantidad * 100);
            er.porcentajeAcumulado = this.getIsNumber(er.cantidadAcumulado / ventas.cantidadAcumulado * 100);
            er.presupuestoPorcentaje = this.getIsNumber(er.cantidadPresupuesto / ventas.cantidadPresupuesto * 100);
            er.presupuestoPorcentajeAcumulado = this.getIsNumber(er.cantidadPresupuestoAcumulado / ventas.cantidadPresupuestoAcumulado * 100);
            break;
          }
          default: { // todos los demás van por utilidad bruta neta
            er.porcentaje = this.getIsNumber(er.cantidad / utilidadBrutaNeta.cantidad * 100);
            er.porcentajeAcumulado = this.getIsNumber(er.cantidadAcumulado / utilidadBrutaNeta.cantidadAcumulado * 100);
            er.presupuestoPorcentaje = this.getIsNumber(er.cantidadPresupuesto / utilidadBrutaNeta.cantidadPresupuesto * 100);
            er.presupuestoPorcentajeAcumulado = this.getIsNumber(er.cantidadPresupuestoAcumulado / utilidadBrutaNeta.cantidadPresupuestoAcumulado * 100);
            break;
          }
        }

        switch (er.descripcion) {
          case 'Utilidad bruta': {
            er.porcentaje = this.getIsNumber(er.cantidad / ventas.cantidad * 100);
            er.porcentajeAcumulado = this.getIsNumber(er.cantidadAcumulado / ventas.cantidadAcumulado * 100);
            er.presupuestoPorcentaje = this.getIsNumber(er.cantidadPresupuesto / ventas.cantidadPresupuesto * 100);
            er.presupuestoPorcentajeAcumulado = this.getIsNumber(er.cantidadPresupuestoAcumulado / ventas.cantidadPresupuestoAcumulado * 100);
            break;
          }
          case 'Utilidad Bruta Neta': {
            er.porcentaje = this.getIsNumber(er.cantidad / ventas.cantidad * 100);
            er.porcentajeAcumulado = this.getIsNumber(er.cantidadAcumulado / ventas.cantidadAcumulado * 100);
            er.presupuestoPorcentaje = this.getIsNumber(er.cantidadPresupuesto / ventas.cantidadPresupuesto * 100);
            er.presupuestoPorcentajeAcumulado = this.getIsNumber(er.cantidadPresupuestoAcumulado / ventas.cantidadPresupuestoAcumulado * 100);
            break;
          }
        }

        // Calcula la variacion
        er.variacion = this.getIsNumber(er.cantidad - er.cantidadPresupuesto);
        er.variacionAcumulado = this.getIsNumber(er.cantidadAcumulado - er.cantidadPresupuestoAcumulado);

        // Calcula porcentaje de variacion
        if (er.cantidadPresupuesto === 0) {
          // Evitar division entre cero
          er.porcentajeVariacion = 100;
        } else {
          er.porcentajeVariacion = this.getIsNumber(er.porcentaje - er.presupuestoPorcentaje);
        }

        // Calcula porcentaje de variacion acumulado
        if (er.cantidadPresupuestoAcumulado === 0) {
          // Evitar division entre cero
          er.porcentajeVariacionAcumulado = 100;
        } else {
          er.porcentajeVariacionAcumulado = this.getIsNumber(er.porcentajeAcumulado - er.presupuestoPorcentajeAcumulado);
        }
      });
    }
  );
}

  getUnidadesDepartamento(): void {
    if (this.selectedIdDepartamento !== 0) {
      this._service.getUnidadesDepartamento({
        idCompania: this.selectedIdSucursal > 0 ?  0 : this.selectedCompania,
        idSucursal: this.selectedIdSucursal > 0 ? this.selectedIdSucursal : 0,
        periodoYear: +this.anio,
        periodoMes: +this.mes,
        idPestana: +this.selectedIdDepartamento
      })
        .subscribe(unidadesDepartamento => {
          this.unidadesDepartamento = unidadesDepartamento;
        },
        error => { this.errorMessage = <any>error; },
        () => {
          if (this.unidadesDepartamento.length === 1) {
            // Se actualizan valores de variacion y % variacion
            const d = this.unidadesDepartamento[0];
            d.variacion = d.cantidad - d.cantidadPresupuesto;
            d.porcentajeVariacion = d.variacion / d.cantidadPresupuesto * 100;

            d.variacionAcumulado = d.cantidadAcumulado - d.cantidadPresupuestoAcumulado;
            d.porcentajeVariacionAcumulado = d.variacionAcumulado / d.cantidadPresupuestoAcumulado * 100;
          }
        }
        );
    } else {
      this.unidadesDepartamento = [];
    }
  }

  getCompanias(): void {
    const usuario = JSON.parse(localStorage.getItem('userLogged'));
    this._service.getCompanias({ idUsuario: usuario.id })
      .subscribe(
        companias => { this.companias = companias; },
        error => this.errorMessage = <any>error);
  }

  getSucursales(): void {
    const usuario = JSON.parse(localStorage.getItem('userLogged'));
    this._service.getSucursales({
      idCompania: this.selectedCompania,
       idUsuario: usuario.id  

    })
      .subscribe(
        sucursales => { this.sucursales = sucursales; },
        error => { this.errorMessage = <any>error; },
        () => { this.onChangeSucursal(0); }
        //() => { this.onChangeSucursal(-2); } TMC se cambia ya que el valor incial es cero
      );
  }

  getDepartamentos(): void {
    const usuario = JSON.parse(localStorage.getItem('userLogged'));
    this._service.getDepartamentos({
       idCompania: this.selectedCompania,
       idSucursal: this.selectedIdSucursal,
       idUsuario: usuario.id
    })
      .subscribe(
        departamentos => { this.departamentos = departamentos; },
        error => this.errorMessage = <any>error,
        () => this.procesar()
      );
  }

  setTipoReporte(): void {
    let usuario = JSON.parse(localStorage.getItem('userLogged'));
    this._service.getTipoReporte({idUsuario: usuario.id})
    .subscribe(
        resp => { this.tipoReporte = resp; },
        error => { },
        () => { }
    );
  }

  setDefaultDate(): void {
    if (!this.mes) {
      const today = new Date();
      const mes = today.getMonth() + 1;
      let mesStr = mes.toString();
      const anio = today.getFullYear().toString();

      if (mes < 10) {
        mesStr = '0' + mesStr;
      }

      this.mes = mesStr;
      this.anio = anio;
      this.periodo = anio + '-' + mesStr;
    }
  }

  getDetalleResultadosMensual(idOrden: number, esAnual: number): void {
    // Este servicio requiere el Id de la sucursal con un cero a la izquierda
    this._service.getEstadoResultadosNv2({
      idCompania: this.selectedCompania,
      idSucursal: this.selectedIdSucursal, // > 0 ? this.selectedIdSucursal : 0,
      periodoYear: this.anio,
      periodoMes: this.mes,
      idDepartamento: this.selectedIdDepartamentoEr,
      idSucursalSecuencia: this.selectedIdSucursalSecuencia,
      idEstadoResultadosI: this.idEstadoResultado || 0,
      idOrden: idOrden,
      esAnual: esAnual
    })
      .subscribe(detalleResultadosMensual => {
        this.detalleResultadosMensual = detalleResultadosMensual;
      },
      error => {
        this.errorMessage = <any>error;
        this.detalleResultadosMensual = [];
      },
      // Si la lista tiene más de 10 resultados se necesita ajustar
      // el ancho de tabla para que quepa el scroll (solo mensual)
      () => {
        this.detalleResultadosMensualScroll = this.detalleResultadosMensual.length <= 10 ? true : false;
        this.fixedHeader('detalleResultadosAcumulado');

        // Ciclo de 12 meses
        for (let mes = 1; mes <= 12; mes++) {
          const nombreMes = this.toLongMonth(mes.toString());

          // Se calculan porcentajes del mes correspondiente
          this.detalleResultadosMensual.forEach(uad => {
              uad.totalAnual = uad.enero + uad.febrero + uad.marzo + uad.abril + uad.mayo + uad.junio + uad.julio +
                uad.agosto + uad.septiembre + uad.octubre + uad.noviembre + uad.diciembre;
          });
        }
      }
    );
  }

  getDetalleResultadosMensualPresupuesto(idOrden: number): void {
    // Este servicio requiere el Id de la sucursal con un cero a la izquierda
    this._service.getEstadoResultadosPresupuestoNv2({
      idCompania: this.selectedCompania,
      idSucursal: this.selectedIdSucursal,// > 0 ? this.selectedIdSucursal : 0,
      periodoYear: this.anio,
      periodoMes: this.mes,
      idDepartamento: this.selectedIdDepartamentoEr,
      idEstadoResultadosI: this.idEstadoResultado || 0,
      idOrden: idOrden,
    })
      .subscribe(detalleResultadosMensual => {
        this.detalleResultadosMensual = detalleResultadosMensual;
      },
      error => {
        this.errorMessage = <any>error;
        this.detalleResultadosMensual = [];
      },
      // Si la lista tiene más de 10 resultados se necesita ajustar
      // el ancho de tabla para que quepa el scroll (solo mensual)
      () => {
        this.detalleResultadosMensual.forEach(x => x.saldoMonto = x[this.toLongMonth(this.mes)]);
        this.detalleResultadosMensualScroll = this.detalleResultadosMensual.length <= 10 ? true : false;
        this.fixedHeader('detalleResultadosAcumulado');

        // Se calculan porcentajes del mes correspondiente
        this.detalleResultadosMensual.forEach(uad => {
          uad.totalAnual = 0;
            for (let mes = 1; mes <= +this.mes; mes++) {
              const nombreMes = this.toLongMonth(mes.toString());
              uad.totalAnual += uad[nombreMes];
            }
          });
      }
    );
  }

  getDetalleResultadosCuentas(numCta: string, mes: string = ''): void {
    // Limpiar tabla antes de consultar
    this.detalleResultadosCuentas = [];

    this._service.getDetalleResultadosCuentas({
      // servidorAgencia: this.selectedIpSucursal,
      // concentradora: this.selectedConcentradora,
      IdCia: this.selectedCompania,
      idSucursal: this.selectedIdSucursal > 0 ? this.selectedIdSucursal : 0,
      anio: this.anio,
      mes:  mes === '' ? this.mes : mes, // Cuando se manda a llamar desde acumulado (lado verde) contiene el parametro de mes
      numCta: numCta
    })
      .subscribe(
        detalleResultadosCuentas => { this.detalleResultadosCuentas = detalleResultadosCuentas; },
        error => {
          this.errorMessage = <any>error;
          this.detalleResultadosCuentas = [];
        },
        // Si la lista tiene más de 10 resultados se necesita ajustar el ancho de tabla para que quepa el scroll
        () => {this.detalleResultadosCuentasScroll = this.detalleResultadosCuentas.length <= 10 ? true : false; }
      );
  }

  getAcumuladoReal(): void {
    this._service.get_AcumuladoReal({
      IdSucursal: this.selectedIdSucursal,
      IdCompania: this.selectedCompania,
      anio: this.anio
    })
      .subscribe(acumuladoReal => {
        this.acumuladoReal = acumuladoReal;
        this.fixedHeader('tableAcumuladoReal');
      },
        error => { this.errorMessage = <any>error; },
        () => {
          const totales = this.acumuladoReal.find(x => x.descripcion.trim() === 'Total Unidades');

          // Ciclo de 12 meses
          for (let mes = 1; mes <= 12; mes++) {
            const nombreMes = this.toLongMonth(mes.toString());

            // Se calcula el total
            const totalMensual = totales[nombreMes];

            // Se calculan porcentajes del mes correspondiente
            this.acumuladoReal.forEach(uap => {
              if (uap.descripcion.trim() !== 'INTERCAMBIOS') {
                if (totalMensual === 0) {
                  uap[nombreMes + 'Perc'] = 0;
                  return;
                }
                uap[nombreMes + 'Perc'] = uap[nombreMes] / totalMensual * 100;
                uap.totalAnual = uap.enero + uap.febrero + uap.marzo + uap.abril + uap.mayo + uap.junio + uap.julio +
                  uap.agosto + uap.septiembre + uap.octubre + uap.noviembre + uap.diciembre;
                uap.totalAnualPerc = 0;
              } else {
                uap[nombreMes + 'Perc'] = 0;
                uap.totalAnual = uap.enero + uap.febrero + uap.marzo + uap.abril + uap.mayo + uap.junio + uap.julio +
                  uap.agosto + uap.septiembre + uap.octubre + uap.noviembre + uap.diciembre;
                uap.totalAnualPerc = 0;
              }
            });
          }

        // Se actualiza el total anual de todas las autoLineas
        totales.totalAnual = this.calculaTotalMensual(this.acumuladoReal, 'totalAnual');

        // Se calculan los porcentajes de totales
        this.acumuladoReal.forEach(dua => {
          dua.totalAnualPerc = dua.totalAnual / totales.totalAnual * 100;
        });
      });
  }

  getResultadosPresupuesto(): void {
    this._service.get_ResultadosPresupuesto({
      idCompania: this.selectedCompania, //this.selectedIdSucursal > 0 ? 0 : this.selectedCompania, TMC
      IdSucursal: this.selectedIdSucursal > 0 ? this.selectedIdSucursal : 0,
      anio: this.anio,
      IdDepartamento: this.selectedIdDepartamentoEr
    })
      .subscribe(acumuladoReal => {
        this.acumuladoReal = acumuladoReal;
        this.fixedHeader('tableAcumuladoPresupuesto');
        this.controlarSpinner(false);
      },
      error => this.errorMessage = <any>error,
      () => {
         // Ciclo de 12 meses
         for (let mes = 1; mes <= 12; mes++) {
          const nombreMes = this.toLongMonth(mes.toString());
          const ventas = this.acumuladoReal.find(x => x.descripcion === 'Ventas');
          const utilidadBrutaNeta = this.acumuladoReal.find(x => x.descripcion === 'Utilidad Bruta Neta');

          // Se calculan porcentajes del mes correspondiente
          this.acumuladoReal.forEach(er => {
            switch (er.descripcion) {
              case 'Ventas': {
                er[nombreMes + 'Perc'] = 100;
                break;
              }
              case 'Utilidad bruta': {
                er[nombreMes + 'Perc'] = er[nombreMes] / ventas[nombreMes] * 100;
                break;
              }
              case 'Utilidad Bruta Neta': {
                er[nombreMes + 'Perc'] = er[nombreMes] / ventas[nombreMes] * 100;
                break;
              }
              case 'Costo de Ventas': {
                er[nombreMes + 'Perc'] = er[nombreMes] / ventas[nombreMes] * 100;
                break;
              }
              case 'Otros Costos': {
                er[nombreMes + 'Perc'] = er[nombreMes] / ventas[nombreMes] * 100;
                break;
              }
              default: {
                er[nombreMes + 'Perc'] = er[nombreMes] / utilidadBrutaNeta[nombreMes] * 100;
                break;
              }
            }
          });
        }
      });
  }

  getUnidadesAcumuladoPresupuesto(): void {
    this._service.getUnidadesAcumuladoPresupuesto({
      idCompania: this.selectedIdSucursal > 0 ? 0 : this.selectedCompania,
      idSucursal: this.selectedIdSucursal > 0 ? this.selectedIdSucursal : 0,
      periodoYear: +this.anio
    })
      .subscribe(unidadesAcumuladoPresupuesto => {
        this.unidadesAcumuladoPresupuesto = unidadesAcumuladoPresupuesto;
      },
      error => this.errorMessage = <any>error,
      () => {
        const totales = this.unidadesAcumuladoPresupuesto.find(x => x.descripcion.trim() === 'Total Unidades');

        // Ciclo de 12 meses
        for (let mes = 1; mes <= 12; mes++) {
          const nombreMes = this.toLongMonth(mes.toString());

          // Se calcula el total
          const totalMensual = totales[nombreMes];

          // Se calculan porcentajes del mes correspondiente
          this.unidadesAcumuladoPresupuesto.forEach(uap => {
            if (uap.descripcion.trim() !== 'INTERCAMBIOS') {
              uap[nombreMes + 'Perc'] = uap[nombreMes] / totalMensual * 100;
              uap.totalAnual = uap.enero + uap.febrero + uap.marzo + uap.abril + uap.mayo + uap.junio + uap.julio +
                uap.agosto + uap.septiembre + uap.octubre + uap.noviembre + uap.diciembre;
              uap.totalAnualPerc = 100;
            } else {
              uap[nombreMes + 'Perc'] = 0;
              uap.totalAnual = uap.enero + uap.febrero + uap.marzo + uap.abril + uap.mayo + uap.junio + uap.julio +
                uap.agosto + uap.septiembre + uap.octubre + uap.noviembre + uap.diciembre;
              uap.totalAnualPerc = 0;
            }
          });
        }
      });
  }

  getUnidadesAcumuladoPresupuestoDepartamento(): void {
    this._service.getUnidadesAcumuladoPresupuestoDepartamento({
      idPestana: +this.selectedIdDepartamento,
      idCompania: this.selectedIdSucursal > 0 ? 0 : this.selectedCompania,
      idSucursal: this.selectedIdSucursal > 0 ? this.selectedIdSucursal : 0,
      periodoYear: +this.anio
    })
      .subscribe(unidadesAcumuladoPresupuestoDepartamento => {
        this.unidadesAcumuladoPresupuestoDepartamento = unidadesAcumuladoPresupuestoDepartamento;
      },
      error => this.errorMessage = <any>error,
      () => {
        // Ciclo de 12 meses
        for (let mes = 1; mes <= 12; mes++) {
          const nombreMes = this.toLongMonth(mes.toString());

          // Se calculan porcentajes del mes correspondiente
          this.unidadesAcumuladoPresupuestoDepartamento.forEach(uad => {
            if (uad.descripcion.trim() !== 'INTERCAMBIOS') {
              uad[nombreMes + 'Perc'] = 100;
              uad.totalAnual = uad.enero + uad.febrero + uad.marzo + uad.abril + uad.mayo + uad.junio + uad.julio +
                uad.agosto + uad.septiembre + uad.octubre + uad.noviembre + uad.diciembre;
              uad.totalAnualPerc = 100;
            }
          });
        }
      });
  }

  getUnidadesAcumuladoRealDepartamento(): void {
    this._service.getUnidadesAcumuladoRealDepartamento({
      idPestana: +this.selectedIdDepartamento,
      idCompania: this.selectedIdSucursal > 0 ? 0 : this.selectedCompania,
      idSucursal: this.selectedIdSucursal > 0 ? this.selectedIdSucursal : 0,
      periodoYear: +this.anio
    })
      .subscribe(unidadesAcumuladoRealDepartamento => {
        this.acumuladoRealDepartamento = unidadesAcumuladoRealDepartamento;
      },
      error => this.errorMessage = <any>error,
      () => {
        // Ciclo de 12 meses
        for (let mes = 1; mes <= 12; mes++) {
          const nombreMes = this.toLongMonth(mes.toString());

          // Se calculan porcentajes del mes correspondiente
          this.acumuladoRealDepartamento.forEach(uad => {
              uad[nombreMes + 'Perc'] = uad[nombreMes] === 0 ? 0 : 100;
              uad.totalAnual = uad.enero + uad.febrero + uad.marzo + uad.abril + uad.mayo + uad.junio + uad.julio +
                uad.agosto + uad.septiembre + uad.octubre + uad.noviembre + uad.diciembre;
              uad.totalAnualPerc = 100;
          });
        }
      });
  }

  // Revisa si la cadena debe ir en negrita
  shouldBeBold(value: string): boolean {
    return this.valuesNegritas.includes(value);
  }

  onChangePeriodo(selectedDate): void {
    if (selectedDate) {
      const mesStr = selectedDate.substring(5, 7);
      const fullYearStr = selectedDate.substring(0, 4);

      this.mes = mesStr;
      this.anio = fullYearStr;
      this.getEstadoDeResultadosCalculo();
      if (this.mes && this.anio && this.selectedCompania !== 0 && this.selectedIdSucursal) {
        this.getDepartamentos();
      }
    }
  }

  onChangeCompania(newValue: number): void {
   // this.changeCursorWait();
    this.showOriginal=0;
    this.showOriginalUD=0;
    this.showOriginalUN=0;
    this.selectedCompania = newValue;
    if (this.selectedCompania==0){
      this.selectedIdSucursal=-2;
      this.selectedTipoReporte=1;
    }else {
      this.controlarSpinner(true);
    }
    
    this.disabledButtonPorcentaje();
            
    if (this.companias.find(x => x.id === +newValue)) {
      const fechaActualizacion = this.companias.find(x => x.id === +newValue).fechaActualizacion;      
      this._fechaActualizacionService.onChangeFecha(fechaActualizacion);
    }
   else{
    this._fechaActualizacionService.onChangeFecha(null);
   }

   if (this.selectedCompania !== 0 && this.selectedTipoReporte <=3) {     
      // Llenar dropdown de sucursales
      this.getSucursales();
      this.selectedIdSucursal = 0;
    
    }
   //if (this.periodo && this.selectedCompania !== 0 && this.selectedIdSucursal!==-2) {
    if ( this.selectedCompania != 0) {
        this.getDepartamentos();
        if(this.showSumaDepartamentos==true){
          this.sumaDepartamentos();
        }
      }
     
    this.hideResultados();
  }
  
  closeDetallesUnidades (): void{
    this.showDetalleUnidadesPrimerNivel= false;
    this.showDetalleUnidadesSegundoNivel= false;
    this.showDetalleUnidadesTercerNivel= false;
  }

 closeDetalleUnidadesConcentrado() : void{
    this.showUnidadesDeptoNivel=1;
  }

  onChangeSucursal(selectedIndex): void {
    if(!this.activeSpinner){
      this.controlarSpinner(true);
    }
    this.selectedIdSucursal = selectedIndex;
    this.closeDetallesUnidades();
    this.closeDetalleUnidadesConcentrado();
    this.selectedIdSucursalSecuencia = this.sucursales.find(x => x.id === +selectedIndex).idSucursalSecuencia;

    if (this.periodo && this.selectedCompania !== 0 && this.selectedIdSucursal) {
      this.getDepartamentos();
    }
  }

  onChangeDepartamento(newValue): void {
    //console.log("NewValue", newValue);
    this.selectedIdDepartamento = newValue;
   // console.log( "selectedIdDepartamento", this.selectedIdDepartamento );
    if (this.departamentos.find(x => x.idPestana === +newValue)) {
      this.selectedIdDepartamentoEr = this.departamentos.find(x => x.idPestana === +newValue).idER || 0;
    } else {
      this.selectedIdDepartamentoEr = 0;
    }
  }

  onChangeSumaDepartamentos(): void {
    const arrIds = [];
    this.selectedDepartamentosStr = '\'';
    this.selectedDepartamentos.forEach(d => {     
      if (d!=="")  {
        
          this.selectedDepartamentosStr += `${d},`;
          var iPos= arrIds.lastIndexOf(`${d}`);
          if(iPos<0){
             arrIds.push( `${d}` );
          }
    }
    });

    this.xmlDepartamento = [];
    if ( arrIds.length === 0 ) {
      this.xmlSend = '';
    } else {
      for ( let i = 0; i <= (arrIds.length - 1); i++ ) {
          this.xmlDepartamento.push('<departamento><id>' + arrIds[ i ] + '</id></departamento>');
      }

      this.xmlSend = '<departamentos>' + this.xmlDepartamento.join('') + '</departamentos>';
     // console.log( 'xmlSend', this.xmlSend );
    }
  }

  onChangeTipoReporte(newValue: number): void {
    this.activeSpinner = true;
    this.selectedTipoReporte = newValue;
    this.showOriginal=0;
    this. showOriginalUD=0;
    this.showOriginalUN=0;
    const nv = newValue.toString();

    if (this.showSumaDepartamentos!== true){
      
        if (nv === '4' || nv === '5') {
          this.hideReporteUnidades();
          this.showAcumuladoReal = false;
          this.showAcumuladoPresupuesto= false;
        }
        this.setDefaultDate();
        this.getSucursales();
        this.getDepartamentos();          
  
    }
    else{
      delete (this.resultadoSumaDepartamentos);
    //  this.showSumaDepartamentos=true;
      switch (nv){
        case '1':
        this.showSumaDepartamentosHeader= true;
        this.showSumaDepartamentosAReal=false;
        break;
        case '2': case '3':      
        this.showSumaDepartamentosHeader= false;
        this.showSumaDepartamentosAReal=true;
        delete(this.sumaDepartamentosAReal);
        break;
        case '4': case '5':
        this.hideSumaDepartamentos();
        break;
      }    
    }
  }

  private hideReporteUnidades() {
    this.showReporteUnidades = false;
    this.showSumaDepartamentos = false;
    this.sucursales = [];
    this.departamentos = [];
  }

  onClickUnidades(i: number, value: number, name: string, idDetalleUnidades: number) {
    const concepto = this.resultadoUnidades[i].descripcion;
    const idOrigen = this.resultadoUnidades[i].idOrigen;

    if (idOrigen !== 0) {
      this.showDetalleUnidadesPrimerNivel = true;
      this.detalleUnidadesName = name;
      this.detalleUnidadesValue = value;
      this.idDetalleUnidades = idDetalleUnidades;
      this.idOrigen = idOrigen;

      // QUITAR UNA
      this.detalleUnidadesConcepto = concepto; // <-----QUITAR despues de refactorizar
      this.unidadesConcepto = concepto;
    }
  }

  onClickUnidadesDepartamento(concepto: string, value: number, name: string, idDetalleUnidades: number) {
    this.showUnidadesDeptoByLevel(2);
    this.detalleUnidadesDepartamentoName = name;
    this.detalleUnidadesDepartamentoValue = value;
    this.idDetalleUnidadesDepartamento = idDetalleUnidades;
    this.detalleUnidadesDepartamentoConcepto = concepto;
  }

  onClickUnidadesAcumuladoReal(i: number, value: number, name: string, idDetalleUnidades: number) {

    const concepto = this.resultadoUnidades[i].descripcion;
    const idOrigen = this.resultadoUnidades[i].idOrigen;

    if (concepto !== 'Total Unidades') {
      this.showUnidadesAcumuladoReal = 2;
      this.detalleUnidadesName = name;
      this.detalleUnidadesValue = value;
      this.idDetalleUnidades = idDetalleUnidades;
      this.idOrigen = idOrigen;

      // QUITAR UNA
      this.detalleUnidadesConcepto = concepto; // <-----QUITAR despues de refactorizar
      this.unidadesConcepto = concepto;
      this.getDetalleUnidadesAcumuladoReal();
    }
  }

  onClickUnidadesAcumuladoRealNv2(idAutoLinea: number, carLine: string) {
    if (carLine.trim() !== 'Total') {
      this.showUnidadesAcumuladoReal = 3;
      this.detalleUnidadesNameSegundoNivel = '';
      this.detalleUnidadesValueSegundoNivel = carLine; // Revisar ya que son 3 que usan el mismo valor
      this.detalleUnidadesConceptoSegundoNivel = carLine;
      this.carLine = carLine;
      this.idAutoLinea = idAutoLinea;
      this.getDetalleUnidadesAcumuladoRealNv3();
    }
  }

  getResultadosAcumuladoXIdER(idOrden: number, idEstado: number): void {

    this._service.get_ResultadosAcumuladoXIdER({
      idCompania:           this.selectedCompania,
      IdSucursal:           this.selectedIdSucursal,
      anio:                 this.anio,
      IdDepartamento:       this.selectedIdDepartamentoEr,
      idEstadoDeResultado:  idEstado,
      idSucursalSecuencia:  this.selectedIdSucursalSecuencia,
      IdOrden:              idOrden
    })
      .subscribe(acumuladoRealNv2 => {
        this.acumuladoRealNv2 = acumuladoRealNv2;
        this.fixedHeader('tableAcumuladoRealNv2');
      },
      error => this.errorMessage = <any>error);
  }

  onClickEstadoResultadosAcumuladoReal(idOrden: number, idEstado: number) {
      if ( idEstado == null ) {
        idEstado = 0;
      }

      this.showEstadoResultadoAcumuladoReal = 2;
      this.getResultadosAcumuladoXIdER(idOrden, idEstado);
  }

  getDetalleUnidadesAcumuladoReal(): void {

    this._service.get_AutoLineaAcumulado({
      IdCompania: this.selectedIdSucursal > 0 ?  0 : this.selectedCompania,
      IdSucursal: this.selectedIdSucursal > 0 ? this.selectedIdSucursal : 0,
      anio: +this.anio,
      mes: +this.mes,
      IdOrigen: this.idOrigen // Nuevas, usadas, etc.
    }).subscribe(
      dum => { this.autoLineaAcumulado = dum; },
      error => { console.log(error); },
      () => {
        const totales: IAutoLineaAcumulado = {
          'UnidadDescripcion': '',
          'idAutoLinea': '',
          'autoLinea': '',
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
        for (let mes = 1; mes <= 12; mes++) {
          const nombreMes = this.toLongMonth(mes.toString());
          // // Se calcula el total
          const totalMensual: number = this.calculaTotalMensual(this.autoLineaAcumulado, nombreMes);

          // // Se actualiza el valor del mes correspondiente
          totales[nombreMes] = totalMensual;

          // // Se calculan porcentajes del mes correspondiente
          this.autoLineaAcumulado.forEach(dua => {
            dua[nombreMes + 'Perc'] = dua[nombreMes] / totalMensual * 100;
            dua.totalAnual = dua.enero + dua.febrero + dua.marzo + dua.abril + dua.mayo + dua.junio + dua.julio +
                             dua.agosto + dua.septiembre + dua.octubre + dua.noviembre + dua.diciembre;
            dua.totalAnualPerc = 0;

          });
        }

        // // Se actualiza el total anual de todas las autoLineas
        totales.totalAnual = this.calculaTotalMensual(this.autoLineaAcumulado, 'totalAnual');

        // // Se calculan los porcentajes de totales
        this.autoLineaAcumulado.forEach(dua => {
          dua.totalAnualPerc = dua.totalAnual / totales.totalAnual * 100;
        });

        // // Se agregan totales al objeto
        this.autoLineaAcumulado.push(totales);
      }
    );
  }

  getDetalleUnidadesAcumuladoRealNv3(): void {
    this._service.get_TipoUnidadAcumulado({
      idCompania: this.selectedIdSucursal > 0 ?  0 : this.selectedCompania,
      idSucursal: this.selectedIdSucursal > 0 ? this.selectedIdSucursal : 0,
      periodoYear: this.anio,
      periodoMes: this.mes,
      idOrigen: this.idOrigen,
      idAutoLinea: this.idAutoLinea
    }).subscribe(
      unidadesNv3 => { this.tipoUnidadAcumulado = unidadesNv3; },
      error => { console.log(error); },
      () => {
        const totales: IAutoLineaAcumulado = {
          'UnidadDescripcion': '',
          'idAutoLinea': '',
          'autoLinea': '',
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
        for (let mes = 1; mes <= 12; mes++) {
          const nombreMes = this.toLongMonth(mes.toString());
          // // Se calcula el total
          const totalMensual: number = this.calculaTotalMensual(this.tipoUnidadAcumulado, nombreMes);

          // // Se actualiza el valor del mes correspondiente
          totales[nombreMes] = totalMensual;

          // Se calculan porcentajes del mes correspondiente
          this.tipoUnidadAcumulado.forEach(dua => {
            dua[nombreMes + 'Perc'] = dua[nombreMes] / totalMensual * 100;
            dua.totalAnual = dua.enero + dua.febrero + dua.marzo + dua.abril + dua.mayo + dua.junio + dua.julio +
                             dua.agosto + dua.septiembre + dua.octubre + dua.noviembre + dua.diciembre;
            dua.totalAnualPerc = 0;

          });
        }
          // // Se actualiza el total anual de todas las autoLineas
          totales.totalAnual = this.calculaTotalMensual(this.tipoUnidadAcumulado, 'totalAnual');

          // // Se calculan los porcentajes de totales
          this.tipoUnidadAcumulado.forEach(dua => {
            dua.totalAnualPerc = dua.totalAnual / totales.totalAnual * 100;
          });

          // // Se agregan totales al objeto
          this.tipoUnidadAcumulado.push(totales);

      }
    );
  }


  onClickResultado(i: number, value: number, name: string, idEstadoResultado: number, idDetalleResultados: number) {

    const idOrden = this.estadoResultados[i].idOrden;
    this.showResultados=false;
    this.showDetallePrimerNivel = true;
    this.detalleName = name;
    this.detalleValue = value;
    this.detalleConcepto = this.estadoResultados[i].descripcion;
    this.idDetalleResultados = idDetalleResultados;
    this.idEstadoResultado = this.estadoResultados[i].idEstadoResultadosI;
    if (name === 'Real' || name === 'AcReal') {
      this.getDetalleResultadosMensual(idOrden, idDetalleResultados);
    }else if( name === "AcVariacion" || name === "Variacion" ){
      if( idDetalleResultados === 2 ){
        this.getDetalleResultadosVariacion(0);
      }else if( idDetalleResultados === 3 ){
        this.getDetalleResultadosVariacion(1);
      }
    }else {
      this.getDetalleResultadosMensualPresupuesto(idOrden);
    }
  }

  getDetalleResultadosVariacion(esAnual): void {
    // Este servicio requiere el Id de la sucursal con un cero a la izquierda
    this._service.getEstadoResultadosVariacion({
      idCompania: this.selectedCompania,
      PeriodoMes: this.mes,
      PeriodoYear: this.anio,
      idEstadoResultadosI: this.idEstadoResultado || 0,
      IdDepartamento: this.selectedIdDepartamento > 0 ? this.selectedIdDepartamento : 0,
      IdSucursal: this.selectedIdSucursal, // > 0 ? this.selectedIdSucursal : 0, 
      idSucursalSecuencia: this.selectedIdSucursalSecuencia,
      EsAnul: esAnual
    }).subscribe(acumuladoVariacion => {
        this.acumuladoVariacion = acumuladoVariacion;
        if (esAnual === 0) {

          this.acumuladoVariacion.forEach(ac => {
            // Calcula La variacion
            ac.variacion = ac.cantidad - ac.cantidadPrespuesto;
            // Calcula el porcentaje de la variacion si variacion es 0 el resultado es del % es 0
            ac.percentVariacion = ((ac.variacion / ac.cantidadPrespuesto) * 100);

            if (ac.percentVariacion === Infinity || ac.percentVariacion === -Infinity) {
              ac.percentVariacion = 0;
            }else if ( ac.cantidad === 0 && ac.cantidadPrespuesto === 0 ) {
              ac.percentVariacion = 0;
            }

          });
        }else if (esAnual === 1 ) {
          this.acumuladoVariacion.forEach(ac => {
            // Calcula la cantidad Real
            ac.cantidad = ( ac.enero + ac.febrero + ac.marzo + ac.abril + ac.mayo + ac.junio +
              ac.julio + ac.agosto + ac.septiembre + ac.octubre + ac.noviembre + ac.diciembre);
            // Calcula La variacion
            ac.variacion = ac.cantidad - ac.cantidadPrespuesto;

            // Calcula el porcentaje de la variacion si variacion es 0 el resultado es del % es 0
            ac.percentVariacion = ((ac.variacion / ac.cantidadPrespuesto) * 100);

            if (ac.percentVariacion === Infinity || ac.percentVariacion === -Infinity) {
              ac.percentVariacion = 0;
            }else if ( ac.cantidad === 0 && ac.cantidadPrespuesto === 0 ) {
              ac.percentVariacion = 0;
            }
          });
      }
      this.fixedHeader('detalleResultadosAcumulado');
      },
      error => {
        this.errorMessage = <any>error;
        this.acumuladoVariacion = [];
      },
      // Si la lista tiene más de 10 resultados se necesita ajustar
      // el ancho de tabla para que quepa el scroll (solo mensual)
      () => {
        // this.detalleResultadosMensualScroll = this.detalleResultadosMensual.length <= 10 ? true : false;
        // this.fixedHeader('detalleResultadosAcumulado');
      }
    );
  }


  // Usa CSS transforms para dejar los titulos fijos en la tabla
  fixedHeader(idTabla): void {
    // Esperar a que se construya la tabla, delay de 1 segundo
    setTimeout(function () {
      if (document.getElementById(idTabla)) {
        document.getElementById(idTabla).addEventListener('scroll', function () {
          const translate = 'translate(0,' + this.scrollTop + 'px)';
          this.querySelector('thead').style.transform = translate;
        });
      }
    }, 1000);
  }

  // Convierte mes numerico a nombre del mes
  toLongMonth(mes: string): string {
    if (mes !== '') {
      const objDate = new Date(mes + '/01/2000'),
        locale = 'es-mx',
        month = objDate.toLocaleString(locale, { month: 'long' });
      return month;
    } else {
      return '';
    }
  }

  // Calcula el valor del tooltip para estado de resultados
  calculaTooltip(value: number, col: number): number {
    let v = 0;
    if (this.unidadesDepartamento[0]) {
      const ud = this.unidadesDepartamento[0];
      switch (col) {
        case 1: v = ud.cantidad;
          break;
        case 3: v = ud.cantidadPresupuesto;
          break;
        case 7: v = ud.cantidadAcumulado;
          break;
        case 9: v = ud.cantidadPresupuestoAcumulado;
          break;
      }
      return value / v;
    } else if (this.resultadoUnidades && +this.selectedIdDepartamento === 0) {
      const u = this.resultadoUnidades.find(x => x.idOrigen === 0);
      switch (col) {
        case 1: v = u.cantidad;
          break;
        case 3: v = u.cantidadPresupuesto;
          break;
        case 7: v = u.cantidadAcumulado;
          break;
        case 9: v = u.cantidadPresupuestoAcumulado;
          break;
      }
      return value / v;
    } else {
      return 0;
    }
  }

  onClickDetalleSegundoNivel(i: number, value: number, name: string, mes: string = '') {
    // validar que solo entre cuando viene de real (excluir Ppto y Variacion)
    if (this.detalleName === 'Real' || this.detalleName === 'AcReal') {
      // Etiqueta de mes usada en breadcrumb
      if (mes !== '') {
        this.detalleNameSegundoNivel = `(${name})`;
      } else {
        this.detalleNameSegundoNivel = '';
      }

      //this.showResultados = false;
      this.showDetallePrimerNivel = false;
      this.showDetalleSegundoNivel = true;
      this.detalleValueSegundoNivel = value;
      this.detalleConceptoSegundoNivel = this.detalleResultadosMensual[i].descripcion;
      this.getDetalleResultadosCuentas(this.detalleResultadosMensual[i].numeroCuenta, mes);
      this.showOriginal=2;
    }
  }

   // ocultamos todos los resultados cuando no hay compañia seleccionada
hideResultados(): void{
  if  (this.selectedCompania==0){
    this.hideSumaDepartamentos();
    this.hideDetalleUnidadesPrimerNivel();
    delete(this.resultadoUnidades);
    delete(this.unidadesDepartamento);
    delete(this.estadoResultados);
    delete(this.sumaDepartamentos);
    delete(this.sumaDepartamentosAReal);
    delete(this.acumuladoReal);
    delete(this.estadoResultadosAcumuladoReal);
    delete(this.autoLineaAcumulado);
    delete(this.tipoUnidadAcumulado);
    delete(this.unidadesAcumuladoPresupuesto);
    delete(this.unidadesAcumuladoPresupuestoDepartamento);   
    delete(this.showUnidadesAcumuladoByLevel);
    this.ngOnInit();
    this.sucursales = [];
    this.departamentos =[];
  }
}

  hideDetalles(): void {
    this.showResultados = true;
    this.showUnidades = true;
    this.showDetalleUnidadesPrimerNivel = false;
    this.showDetalleUnidadesSegundoNivel = false;
    this.showDetalleUnidadesTercerNivel = false;
    this.showDetallePrimerNivel = false;
    this.showDetalleSegundoNivel = false;
  }

  hideDetalleUnidadesPrimerNivel(): void {
    this.showUnidades = true;
    this.showDetalleUnidadesSegundoNivel = false;
    this.showDetalleUnidadesTercerNivel = false;
    this.showDetalleUnidadesPrimerNivel = false;
  }

  hideDetalleUnidadesSegundoNivel(): void {
    this.showUnidades = false;
    this.showDetalleUnidadesSegundoNivel = false;
    this.showDetalleUnidadesTercerNivel = false;
    this.showDetalleUnidadesPrimerNivel = true;
  }

  hideDetalleUnidadesTercerNivel(): void {
    this.showUnidades = false;
    this.showDetalleUnidadesSegundoNivel = true;
    this.showDetalleUnidadesTercerNivel = false;
    this.showDetalleUnidadesPrimerNivel = false;
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
    this.fixedHeader('detalleResultadosAcumulado');
  }

  showUnidadesAcumuladoByLevel(level: number) {
    this.showUnidadesAcumuladoReal = level;
  }

  showUnidadesDeptoByLevel(level: number) {
    this.showUnidadesDeptoNivel = level;
  }

  showEstadoResultadoAcumuladoByLevel(level: number) {
    this.showEstadoResultadoAcumuladoReal = level;
  }

  showEstadoResultadosAcumuladoRealByLevel(level: number) {
    this.showEstadoResultadoAcumuladoReal = level;
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

  // Selecciona o deselecciona todas las opciones del select suma de departamentos
  // True = Todos, False = ninguno
  selectTodosDeptos(selected: boolean) {
    // Se actualizan los departamentos seleccionados a TODOS
    if (selected===true){
        this.departamentos.forEach(d => {
          d.Selected = !selected;
        })
    }

    this.departamentos.forEach(d => {
      d.Selected = selected;
      if (selected === true) {  
      var iPos= this.selectedDepartamentos.lastIndexOf(`${d.idER}`);
      if(iPos<0){
        this.selectedDepartamentos.push(`${d.idER}`);
        }
      }
      else{
        this.selectedDepartamentos = [''];
      }
    });

    // Se dispara el evento de cambio en los departamentos seleccionados
   this.onChangeSumaDepartamentos();
  }
  // Se encarga de controlar el spinner
  controlarSpinner(estado) {
    this.activeSpinner = estado;
  }
}

