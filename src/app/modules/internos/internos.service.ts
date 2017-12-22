import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { IResultadoInternos } from './resultado-internos';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import { ICompania } from './compania';
import { ISucursal } from './sucursal';
import { IDepartamento } from './departamento';
import { IEfectivoSituacion } from './efectivo-y-situacion-financiera';
import { IDetalleUnidadesMensual } from './detalle-unidades-mensual';
import { IDetalleResultadosMensual } from './detalle-resultados-mensual';
import { IDetalleResultadosCuentas } from './detalle-resultados-cuentas';
import { ITipoUnidad } from './tipo-unidad';
import { IDetalleUnidadesAcumulado } from './detalle-unidades-acumulado';

@Injectable()
export class InternosService {

  private _urlUnidades = 'api/internos/internos';
  private _urlEstadoResultados = 'api/internos/estadoresultados';
  private _urlCompanias = 'api/internos/companias';
  private _urlSucursales = 'api/internos/sucursales';
  private _urlDepartamentos = 'api/internos/departamentos';
  private _urlUnidadesDepartamento = 'api/internos/unidadesdepto';
  private _urlEfectivoSituacion = 'api/internos/efectivoysituacion';
  private _urlDetalleUnidadesMensual = 'api/internos/detalleunidadesmensual';
  private _urlDetalleUnidadesTipo = 'api/internos/detalleunidadestipo';
  private _urlDetalleUnidadesAcumulado = 'api/internos/detalleunidadesacumulado';
  private _urlDetalleResultadosMensual = 'api/internos/detalleresultadosmensual';
  private _urlDetalleResultadosCuentas = 'api/internos/detalleresultadoscuentas';

  constructor(private _http: HttpClient) { }

  getUnidades(parameters): Observable<IResultadoInternos[]> {
    // Initialize Params Object
    let Params = new HttpParams();

    // Begin assigning parameters
    Params = Params.append('idcia', parameters.idCia);
    Params = Params.append('idsucursal', parameters.idSucursal)
    Params = Params.append('anio', parameters.anio);
    Params = Params.append('mes', parameters.mes);

    return this._http.get<IResultadoInternos[]>(this._urlUnidades, { params: Params })
      // .do(data => console.log('All:' + JSON.stringify(data)))
      .catch(this.handleError);
  }

  getEstadoResultados(parameters): Observable<IResultadoInternos[]> { //Se reutiliza la interfaz de unidades
    // Initialize Params Object
    let Params = new HttpParams();

    // Begin assigning parameters
    Params = Params.append('idcia', parameters.idCia);
    Params = Params.append('idsucursal', parameters.idSucursal)
    Params = Params.append('departamento', parameters.departamento)
    Params = Params.append('anio', parameters.anio);
    Params = Params.append('mes', parameters.mes);

    return this._http.get<IResultadoInternos[]>(this._urlEstadoResultados, { params: Params })
      // .do(data => console.log('All:' + JSON.stringify(data)))
      .catch(this.handleError);
  }

  getUnidadesDepartamento(parameters): Observable<IResultadoInternos[]> { //Se reutiliza la interfaz de unidades
    // Initialize Params Object
    let Params = new HttpParams();

    // Begin assigning parameters
    Params = Params.append('idcia', parameters.idCia);
    Params = Params.append('idsucursal', parameters.idSucursal)
    Params = Params.append('departamento', parameters.departamento)
    Params = Params.append('anio', parameters.anio);
    Params = Params.append('mes', parameters.mes);

    return this._http.get<IResultadoInternos[]>(this._urlUnidadesDepartamento, { params: Params })
      // .do(data => console.log('All:' + JSON.stringify(data)))
      .catch(this.handleError);
  }

  getCompanias(parameters): Observable<ICompania[]> {
    // Initialize Params Object
    let Params = new HttpParams();

    // Begin assigning parameters
    Params = Params.append('idusuario', parameters.idUsuario);
    // Params = Params.append('secondParameter', parameters.valueTwo);

    return this._http.get<ICompania[]>(this._urlCompanias, { params: Params })
      // .do(data => console.log('All:' + JSON.stringify(data)))
      .catch(this.handleError);
  }

  getSucursales(parameters): Observable<ISucursal[]> {
    // Initialize Params Object
    let Params = new HttpParams();

    // Begin assigning parameters
    Params = Params.append('idreporte', parameters.idTipoReporte);
    Params = Params.append('idcia', parameters.idAgencia);

    return this._http.get<ISucursal[]>(this._urlSucursales, { params: Params })
      // .do(data => console.log('All:' + JSON.stringify(data)))
      .catch(this.handleError);
  }

  getDepartamentos(parameters): Observable<IDepartamento[]> {
    // Initialize Params Object
    let Params = new HttpParams();

    // Begin assigning parameters
    Params = Params.append('idreporte', parameters.idReporte);
    Params = Params.append('idsucursal', parameters.idSucursal);
    Params = Params.append('idcia', parameters.idAgencia);
    Params = Params.append('anio', parameters.anio);
    Params = Params.append('mes', parameters.mes);

    return this._http.get<IDepartamento[]>(this._urlDepartamentos, { params: Params })
      // .do(data => console.log('All:' + JSON.stringify(data)))
      .catch(this.handleError);
  }

  getDetalleUnidadesMensual(parameters): Observable<IDetalleUnidadesMensual[]> {
    // Initialize Params Object
    let Params = new HttpParams();

    // Begin assigning parameters
    Params = Params.append('idcia', parameters.idAgencia);
    Params = Params.append('msuc', parameters.mSucursal);
    Params = Params.append('anio', parameters.anio);
    Params = Params.append('mes', parameters.mes);
    Params = Params.append('concepto', parameters.concepto);

    return this._http.get<IDetalleUnidadesMensual[]>(this._urlDetalleUnidadesMensual, { params: Params })
      .catch(this.handleError);
  }

  getDetalleUnidadesTipo(parameters): Observable<ITipoUnidad[]> {
    // Initialize Params Object
    let Params = new HttpParams();

    // Begin assigning parameters
    Params = Params.append('idcia', parameters.idAgencia);
    Params = Params.append('msuc', parameters.mSucursal);
    Params = Params.append('anio', parameters.anio);
    Params = Params.append('mes', parameters.mes);
    Params = Params.append('departamento', parameters.departamento);
    Params = Params.append('carline', parameters.carLine);
    Params = Params.append('tipoauto', parameters.tipoAuto);

    return this._http.get<ITipoUnidad[]>(this._urlDetalleUnidadesTipo, { params: Params })
      .catch(this.handleError);
  }

  getDetalleUnidadesAcumulado(parameters): Observable<IDetalleUnidadesAcumulado[]> {
    // Initialize Params Object
    let Params = new HttpParams();

    // Begin assigning parameters
    Params = Params.append('idcia', parameters.idAgencia);
    Params = Params.append('msuc', parameters.mSucursal);
    Params = Params.append('anio', parameters.anio);
    Params = Params.append('mes', parameters.mes);
    Params = Params.append('departamento', parameters.departamento);

    return this._http.get<IDetalleUnidadesAcumulado[]>(this._urlDetalleUnidadesAcumulado, { params: Params })
      .catch(this.handleError);
  }

  getDetalleResultadosMensual(parameters): Observable<IDetalleResultadosMensual[]> {
    // Initialize Params Object
    let Params = new HttpParams();

    // Begin assigning parameters
    Params = Params.append('idcia', parameters.idAgencia);
    Params = Params.append('anio', parameters.anio);
    Params = Params.append('mes', parameters.mes);
    Params = Params.append('idsucursal', parameters.idSucursal);
    Params = Params.append('msucursal', parameters.mSucursal);
    Params = Params.append('departamento', parameters.departamento);
    Params = Params.append('concepto', parameters.concepto);
    Params = Params.append('idEstadoDeResultado', parameters.idEstadoDeResultado);
    Params = Params.append('idDetalle', parameters.idDetalle);

    return this._http.get<IDetalleResultadosMensual[]>(this._urlDetalleResultadosMensual, { params: Params })
      .catch(this.handleError);
  }

  getDetalleResultadosCuentas(parameters): Observable<IDetalleResultadosCuentas[]> {
    // Initialize Params Object
    let Params = new HttpParams();

    // Begin assigning parameters
    Params = Params.append('servidoragencia', parameters.servidorAgencia);
    Params = Params.append('concentradora', parameters.concentradora);
    Params = Params.append('anio', parameters.anio);
    Params = Params.append('mes', parameters.mes);
    Params = Params.append('numcta', parameters.numCta);

    return this._http.get<IDetalleResultadosCuentas[]>(this._urlDetalleResultadosCuentas, { params: Params })
      .catch(this.handleError);
  }

  get_EfectivoSituacion(parameters): Observable<IEfectivoSituacion[]> {
    // Initialize Params Object
    let Params = new HttpParams();

    // Begin assigning parameters
    Params = Params.append('idreporte', parameters.idTipoReporte);
    Params = Params.append('idcia', parameters.idAgencia);
    Params = Params.append('anio', parameters.anio);

    return this._http.get<IEfectivoSituacion[]>(this._urlEfectivoSituacion, { params: Params })
      // .do(data => console.log('All:' + JSON.stringify(data)))
      .catch(this.handleError);
  }

  private handleError(err: HttpErrorResponse) {
    console.error(err.message);
    return Observable.throw(err.message);
  }

}
