import { LoginPage } from './../login/login';
import { AuthProvider } from './../../providers/auth/auth';
import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'forgot-password-page',
  templateUrl: 'forgot-password.html'
})
export class ForgotPasswordPage {

  // formulario
  forgot_password: FormGroup;

  // pagina principal
  main_page: { component: any };

  // erros no formulario
  public hasError: any = false;

  // metodo construtor
  constructor(  public loadingCtrl: LoadingController, 
                public auth: AuthProvider,
                public nav: NavController) {
    this.main_page = { component: LoginPage };
    this.forgot_password = new FormGroup({
      email: new FormControl('', Validators.required)
    });
  }

  recoverPassword(){

    // exibe o loading
    const loading = this.loadingCtrl.create( { content: 'Enviando e-mail ...' } );
    loading.present();

    // pega os dados do formulario
    const form = JSON.parse( JSON.stringify ( this.forgot_password.value ) );

    // envia o email
    this.auth.resetPassword( form.email )
    .then( usr => {
      
      // redireciona para a pagina inicial
      this.nav.setRoot(this.main_page.component);      
    })
    .catch( err => {
      this.hasError = err['code'];
      console.log( err );
    })
    .then( () => loading.dismiss() );
  }
}
