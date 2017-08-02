import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { TabsNavigationPage } from '../tabs-navigation/tabs-navigation';
import * as firebase from 'firebase';

@Component({
  selector: 'forgot-password-page',
  templateUrl: 'forgot-password.html'
})
export class ForgotPasswordPage {

  // formulario
  forgot_password: FormGroup;

  // erros
  public hasError: any = false;

  constructor(public nav: NavController, public loadingCtrl: LoadingController ) {
    this.forgot_password = new FormGroup({
      email: new FormControl('', Validators.required)
    });
  }

  recoverPassword(){

    // mostra o loading
    const loading = this.loadingCtrl.create( { content: 'Enviando email...' } );
    loading.present();

    // pega os dados do form
    const dados = JSON.parse( JSON.stringify( this.forgot_password.value ) );

    // chama o firebase
    firebase.auth().sendPasswordResetEmail( dados['email'] )
    .then( usr => {
      console.log( usr );
    })
    .catch( err => {

      // seta o erro
      this.hasError = err['code'];
    })
    .then( () => loading.dismiss() );
  }

}
