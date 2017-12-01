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

@Injectable()
export class InternosService {

  private _urlUnidades = 'api/internos/internos';
  private _urlEstadoResultados = 'api/internos/estadoresultados';
  private _urlCompanias = 'api/internos/companias';
  private _urlSucursales = 'api/internos/sucursales';
  private _urlDepartamentos = 'api/internos/departamentos';
  private _urlUnidadesDepartamento = 'api/internos/unidadesdepto';
  private _urlEfectivoSituacion = 'api/internos/efectivoysituacion';

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
