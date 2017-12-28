import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../router.animations';
import { LoginService } from './login.service';
import { IAuth } from './auth';
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [routerTransition()]
})
export class LoginComponent implements OnInit {
  authUsuario: IAuth[];
  mensajeUsuario: string;
  signupForm: FormGroup;
  usuario: FormControl;
  password: FormControl;

  constructor(private _service: LoginService, public router: Router) { }

  ngOnInit() {
    this.createFormControls();
    this.createForm();
    this.onChanges();
  }

  //Borra mensaje de usuario cuando se edita el formulario
  onChanges(): void {
    this.signupForm.valueChanges.subscribe(val => {
      this.mensajeUsuario = '';
    });
  }

  //Cacha el submit del formulario y llama el sp de login
  onSubmit() {
    if (this.signupForm.valid) {
      this.mensajeUsuario = '';
      this.getAuth();
    }
  }

  //Cuando todo OK, guarda la variable local que usa AuthGuard
  onLoggedIn() {
    localStorage.setItem('isLoggedin', 'true');
    this.router.navigateByUrl('');
  }

  //Invoca el servicio de Login
  getAuth(): void {
    this._service.getAuth({
      usuario: this.usuario.value,
      password: this.password.value,
      mensajeUsuario: ''
    })
      .subscribe(
        auth => { this.authUsuario = auth; },
        error => { this.mensajeUsuario = <any>error },
      () => {
          //Cuando el servicio no regresa un mensaje de usuario, significa que
          //la autenticación es correcta.
          if (!this.authUsuario[0].MensajeUsuario) {
            this.onLoggedIn();
          }
          else {
            this.mensajeUsuario = this.authUsuario[0].MensajeUsuario;
          }
        } //LocalStorage para el usuario?
      );
  }

  createFormControls() {
    this.usuario = new FormControl('', [
      Validators.required,
      Validators.maxLength(100)
    ]);
    this.password = new FormControl('', [
      Validators.required,
      Validators.maxLength(10)
    ]);
  }

  createForm() {
    this.signupForm = new FormGroup({
      usuario: this.usuario,
      password: this.password,
    });
  }
}
