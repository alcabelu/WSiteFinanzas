import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import { IAuth } from './auth';

@Injectable()
export class LoginService {
  private _urlLogin = 'api/login/auth';
  constructor(private _http: HttpClient) { }

  private handleError(err: HttpErrorResponse) {
    console.error(err.message);
    return Observable.throw(err.message);
  }

  getAuth(parameters): Observable<IAuth[]> {
    // Initialize Params Object
    let Params = new HttpParams();

    // Begin assigning parameters
    Params = Params.append('usuario', parameters.usuario);
    Params = Params.append('password', parameters.password)
    Params = Params.append('mensajeUsuario', parameters.mensajeUsuario);

    return this._http.get<IAuth[]>(this._urlLogin, { params: Params })
      // .do(data => console.log('All:' + JSON.stringify(data)))
      .catch(this.handleError);
  }
}
