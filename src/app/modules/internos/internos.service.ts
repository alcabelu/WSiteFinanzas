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
import { ISeries } from './series';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

@Injectable()
export class InternosService {

  private _urlUnidades = 'api/internos/internos';
  private _urlEstadoResultados = 'api/internos/estadoresultados';
  private _urlSumaDepartamentos = 'api/internos/sumadepartamentos';
  private _urlCompanias = 'api/internos/companias';
  private _urlSucursales = 'api/internos/sucursales';
  private _urlDepartamentos = 'api/internos/departamentos';
  private _urlUnidadesDepartamento = 'api/internos/unidadesdepto';
  private _urlEfectivoSituacion = 'api/internos/efectivoysituacion';
  private _urlDetalleUnidadesMensual = 'api/internos/detalleunidadesmensual';
  private _urlDetalleUnidadesMensualFlotillas = 'api/internos/detalleunidadesmensualflotillas';
  private _urlDetalleUnidadesTipo = 'api/internos/detalleunidadestipo';
  private _urlDetalleUnidadesTipoFlotillas = 'api/internos/detalleunidadestipoflotillas';
  private _urlDetalleUnidadesTipoAcumulado = 'api/internos/detalleunidadestipoacumulado';
  private _urlDetalleUnidadesTipoAcumuladoFlotillas = 'api/internos/detalleunidadestipoacumuladoflotillas';
  private _urlDetalleUnidadesSeries = 'api/internos/detalleunidadesseries';
  private _urlDetalleUnidadesAcumulado = 'api/internos/detalleunidadesacumulado';
  private _urlDetalleUnidadesAcumuladoFlotillas = 'api/internos/detalleunidadesacumuladoflotillas';
  private _urlDetalleResultadosMensual = 'api/internos/detalleresultadosmensual';
  private _urlDetalleResultadosCuentas = 'api/internos/detalleresultadoscuentas';

  constructor(private _http: HttpClient) { }

  getUnidades(parameters): Observable<IResultadoInternos[]> {
    // Initialize Params Object
    let Params = new HttpParams();

    // Begin assigning parameters
    Params = Params.append('idCompania', parameters.idCompania);
    Params = Params.append('idSucursal', parameters.idSucursal);
    Params = Params.append('periodoYear', parameters.periodoYear);
    Params = Params.append('periodoMes', parameters.periodoMes);

    return this._http.get<IResultadoInternos[]>(this._urlUnidades, { params: Params })
      // .do(data => console.log('All:' + JSON.stringify(data)))
      .catch(this.handleError);
  }

  getEstadoResultados(parameters): Observable<IResultadoInternos[]> { // Se reutiliza la interfaz de unidades
    // Initialize Params Object
    let Params = new HttpParams();

    // Begin assigning parameters
    Params = Params.append('idcia', parameters.idCia);
    Params = Params.append('idsucursal', parameters.idSucursal);
    Params = Params.append('departamento', parameters.departamento);
    Params = Params.append('anio', parameters.anio);
    Params = Params.append('mes', parameters.mes);

    return this._http.get<IResultadoInternos[]>(this._urlEstadoResultados, { params: Params })
      // .do(data => console.log('All:' + JSON.stringify(data)))
      .catch(this.handleError);
  }

  getSumaDepartamentos(parameters): Observable<IResultadoInternos[]> { // Se reutiliza la interfaz de unidades
    // Initialize Params Object
    let Params = new HttpParams();

    // Begin assigning parameters
    Params = Params.append('idcia', parameters.idCia);
    Params = Params.append('idsucursal', parameters.idSucursal);
    Params = Params.append('departamento', parameters.departamento);
    Params = Params.append('anio', parameters.anio);
    Params = Params.append('mes', parameters.mes);

    return this._http.get<IResultadoInternos[]>(this._urlSumaDepartamentos, { params: Params })
      .catch(this.handleError);
  }

  getUnidadesDepartamento(parameters): Observable<IResultadoInternos[]> { // Se reutiliza la interfaz de unidades
    // Initialize Params Object
    let Params = new HttpParams();

    // Begin assigning parameters
    Params = Params.append('idcia', parameters.idCia);
    Params = Params.append('idsucursal', parameters.idSucursal);
    Params = Params.append('departamento', parameters.departamento);
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
    Params = Params.append('idCompania', parameters.idCompania);

    return this._http.get<ISucursal[]>(this._urlSucursales, { params: Params })
      // .do(data => console.log('All:' + JSON.stringify(data)))
      .catch(this.handleError);
  }

  getDepartamentos(parameters): Observable<IDepartamento[]> {
    // Initialize Params Object
    // let Params = new HttpParams();

    // Begin assigning parameters
    // Params = Params.append('idreporte', parameters.idReporte);
    // Params = Params.append('idsucursal', parameters.idSucursal);
    // Params = Params.append('idcia', parameters.idAgencia);
    // Params = Params.append('anio', parameters.anio);
    // Params = Params.append('mes', parameters.mes);

    // return this._http.get<IDepartamento[]>(this._urlDepartamentos, { params: Params })

    return this._http.get<IDepartamento[]>(this._urlDepartamentos)
      // .do(data => console.log('All:' + JSON.stringify(data)))
      .catch(this.handleError);
  }

  getDetalleUnidadesMensual(parameters): Observable<IDetalleUnidadesMensual[]> {
    // Initialize Params Object
    let Params = new HttpParams();

    // Begin assigning parameters
    Params = Params.append('idCompania', parameters.idCompania);
    Params = Params.append('idSucursal', parameters.idSucursal);
    Params = Params.append('periodoYear', parameters.periodoYear);
    Params = Params.append('periodoMes', parameters.periodoMes);
    Params = Params.append('idOrigen', parameters.idOrigen);

    return this._http.get<IDetalleUnidadesMensual[]>(this._urlDetalleUnidadesMensual, { params: Params })
      .catch(this.handleError);
  }

  getDetalleUnidadesMensualFlotillas(parameters): Observable<IDetalleUnidadesMensual[]> {
    // Initialize Params Object
    let Params = new HttpParams();

    // Begin assigning parameters
    Params = Params.append('idCompania', parameters.idCompania);
    Params = Params.append('idSucursal', parameters.idSucursal);
    Params = Params.append('periodoYear', parameters.periodoYear);
    Params = Params.append('periodoMes', parameters.periodoMes);
    Params = Params.append('idOrigen', parameters.idOrigen);

    return this._http.get<IDetalleUnidadesMensual[]>(this._urlDetalleUnidadesMensualFlotillas, { params: Params })
      .catch(this.handleError);
  }

  getDetalleUnidadesTipo(parameters): Observable<ITipoUnidad[]> {
    // Initialize Params Object
    let Params = new HttpParams();

    // Begin assigning parameters
    Params = Params.append('idCompania', parameters.idCompania);
    Params = Params.append('idSucursal', parameters.idSucursal);
    Params = Params.append('idOrigen', parameters.idOrigen);
    Params = Params.append('periodoYear', parameters.periodoYear);
    Params = Params.append('periodoMes', parameters.periodoMes);
    Params = Params.append('idAutoLinea', parameters.idAutoLinea);

    return this._http.get<ITipoUnidad[]>(this._urlDetalleUnidadesTipo, { params: Params })
      .catch(this.handleError);
  }

  getDetalleUnidadesTipoFlotillas(parameters): Observable<ITipoUnidad[]> {
    // Initialize Params Object
    let Params = new HttpParams();

    // Begin assigning parameters
    Params = Params.append('idDepartamento', parameters.idDepartamento);
    Params = Params.append('idCompania', parameters.idCompania);
    Params = Params.append('idSucursal', parameters.idSucursal);
    Params = Params.append('idOrigen', parameters.idOrigen);
    Params = Params.append('periodoYear', parameters.periodoYear);
    Params = Params.append('periodoMes', parameters.periodoMes);
    Params = Params.append('idAutoLinea', parameters.idAutoLinea);

    return this._http.get<ITipoUnidad[]>(this._urlDetalleUnidadesTipoFlotillas, { params: Params })
      .catch(this.handleError);
  }

  getDetalleUnidadesTipoAcumulado(parameters): Observable<ITipoUnidad[]> {
    // Initialize Params Object
    let Params = new HttpParams();

    // Begin assigning parameters
    // Begin assigning parameters
    Params = Params.append('idCompania', parameters.idCompania);
    Params = Params.append('idSucursal', parameters.idSucursal);
    Params = Params.append('idOrigen', parameters.idOrigen);
    Params = Params.append('periodoYear', parameters.periodoYear);
    Params = Params.append('periodoMes', parameters.periodoMes);
    Params = Params.append('idAutoLinea', parameters.idAutoLinea);

    return this._http.get<any>(this._urlDetalleUnidadesTipoAcumulado, { params: Params })
    .catch((err: Response) => {
      const details = err.json();
      return Observable.throw(details);
   });
  }

  getDetalleUnidadesTipoAcumuladoFlotillas(parameters): Observable<ITipoUnidad[]> {
    // Initialize Params Object
    let Params = new HttpParams();

    // Begin assigning parameters
    Params = Params.append('idDepartamento', parameters.idDepartamento);
    Params = Params.append('idCompania', parameters.idCompania);
    Params = Params.append('idSucursal', parameters.idSucursal);
    Params = Params.append('idOrigen', parameters.idOrigen);
    Params = Params.append('periodoYear', parameters.periodoYear);
    Params = Params.append('periodoMes', parameters.periodoMes);
    Params = Params.append('idAutoLinea', parameters.idAutoLinea);

    return this._http.get<any>(this._urlDetalleUnidadesTipoAcumuladoFlotillas, { params: Params })
    .catch((err: Response) => {
      const details = err.json();
      return Observable.throw(details);
   });
  }

  getDetalleUnidadesSeries(parameters): Observable<ISeries[]> {
    // Initialize Params Object
    let Params = new HttpParams();

    // Begin assigning parameters
    Params = Params.append('idCompania', parameters.idCompania);
    Params = Params.append('idSucursal', parameters.idSucursal);
    Params = Params.append('idOrigen', parameters.idOrigen);
    Params = Params.append('periodoYear', parameters.periodoYear);
    Params = Params.append('periodoMes', parameters.periodoMes);
    Params = Params.append('unidadDescripcion', parameters.unidadDescripcion);

    return this._http.get<ISeries[]>(this._urlDetalleUnidadesSeries, { params: Params })
      .catch(this.handleError);
  }

  getDetalleUnidadesAcumulado(parameters): Observable<IDetalleUnidadesAcumulado[]> {
    // Initialize Params Object
    let Params = new HttpParams();

    // Begin assigning parameters
    Params = Params.append('idCompania', parameters.idCompania);
    Params = Params.append('idSucursal', parameters.idSucursal);
    Params = Params.append('periodoYear', parameters.periodoYear);
    Params = Params.append('periodoMes', parameters.periodoMes);
    Params = Params.append('idOrigen', parameters.idOrigen);

    return this._http.get<IDetalleUnidadesAcumulado[]>(this._urlDetalleUnidadesAcumulado, { params: Params })
      .catch(this.handleError);
  }

  getDetalleUnidadesAcumuladoFlotillas(parameters): Observable<IDetalleUnidadesAcumulado[]> {
    // Initialize Params Object
    let Params = new HttpParams();

    // Begin assigning parameters
    Params = Params.append('idCompania', parameters.idCompania);
    Params = Params.append('idSucursal', parameters.idSucursal);
    Params = Params.append('periodoYear', parameters.periodoYear);
    Params = Params.append('periodoMes', parameters.periodoMes);
    Params = Params.append('idOrigen', parameters.idOrigen);

    return this._http.get<IDetalleUnidadesAcumulado[]>(this._urlDetalleUnidadesAcumuladoFlotillas, { params: Params })
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
    // Params = Params.append('servidoragencia', parameters.servidorAgencia);
    // Params = Params.append('concentradora', parameters.concentradora);

    Params = Params.append('IdCia', parameters.IdCia);
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
