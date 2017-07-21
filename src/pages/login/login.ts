import { AuthProvider } from './../../providers/auth/auth';
import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';

import { TabsNavigationPage } from '../tabs-navigation/tabs-navigation';
import { SignupPage } from '../signup/signup';
import { ForgotPasswordPage } from '../forgot-password/forgot-password';


@Component({
  selector: 'login-page',
  templateUrl: 'login.html',
  providers: [ AuthProvider ]
})
export class LoginPage {
  
  // formulario de login
  public login: FormGroup;
  
  // pagina principal
  public main_page: { component: any };

  // loading
  public loading: any;

  // se tem erros no formulario
  public hasError: any = false;

  // método construtor
  constructor(
    public nav: NavController,
    public loadingCtrl: LoadingController,
    public auth: AuthProvider
  ) {

    // seta a pagina inicial
    this.main_page = { component: TabsNavigationPage };

    // seta o formulario de login
    this.login = new FormGroup({
      cpf: new FormControl( '', Validators.required ),
      email: new FormControl( '', Validators.required ),
      password: new FormControl( '', Validators.required )
    });
  }

  // faz o login
  public doLogin(){

    // cria o loading
    const loading = this.loadingCtrl.create( { content: 'Entrando ...' } );
    loading.present();

    // pega os dados do form
    const dados = JSON.parse( JSON.stringify( this.login.value ) );

    // faz o login
    this.auth.login( dados )
    .catch( err => {
      console.log( err );
      this.hasError = err;
    })
    .then( () => loading.dismiss() );

    return false;
  }

  goToSignup() {
    this.nav.push(SignupPage);
  }

  goToForgotPassword() {
    this.nav.push(ForgotPasswordPage);
  }
}
