import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';

import { TabsNavigationPage } from '../tabs-navigation/tabs-navigation';
import { SignupPage } from '../signup/signup';
import { ForgotPasswordPage } from '../forgot-password/forgot-password';

// import { FacebookLoginService } from '../facebook-login/facebook-login.service';

import * as firebase from 'firebase';

@Component({
  selector: 'login-page',
  templateUrl: 'login.html'
})
export class LoginPage {
  login: FormGroup;
  main_page: { component: any };
  loading: any;

  public hasError: any = false;

  constructor(
    public nav: NavController,
    // public facebookLoginService: FacebookLoginService,
    public loadingCtrl: LoadingController
  ) {
    this.main_page = { component: TabsNavigationPage };

    // formulario de login
    this.login = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
  }

  doLogin(){
    
    // mostra o loading
    const loading = this.loadingCtrl.create( { content: 'Entrando...' } );
    loading.present();

    // pega os dados do form
    const dados = JSON.parse( JSON.stringify( this.login.value ) );

    // faz o login
    firebase.auth().signInWithEmailAndPassword( dados['email'], dados['password'] )
    .catch( err => {

      // seta o erro
      this.hasError = err['code'];
    })
    .then( () => loading.dismiss() );
  }

  doFacebookLogin() {
    // this.loading = this.loadingCtrl.create();

    // // Here we will check if the user is already logged in because we don't want to ask users to log in each time they open the app
    // let env = this;

    // this.facebookLoginService.getFacebookUser()
    // .then(function(data) {
    //    // user is previously logged with FB and we have his data we will let him access the app
    //   env.nav.setRoot(env.main_page.component);
    // }, function(error){
    //   //we don't have the user data so we will ask him to log in
    //   env.facebookLoginService.doFacebookLogin()
    //   .then(function(res){
    //     env.loading.dismiss();
    //     env.nav.setRoot(env.main_page.component);
    //   }, function(err){
    //     console.log("Facebook Login error", err);
    //   });
    // });
  }

  doGoogleLogin() {
    // this.loading = this.loadingCtrl.create();

    // // Here we will check if the user is already logged in because we don't want to ask users to log in each time they open the app
    // let env = this;

    // this.googleLoginService.trySilentLogin()
    // .then(function(data) {
    //    // user is previously logged with Google and we have his data we will let him access the app
    //   env.nav.setRoot(env.main_page.component);
    // }, function(error){
    //   //we don't have the user data so we will ask him to log in
    //   env.googleLoginService.doGoogleLogin()
    //   .then(function(res){
    //     env.loading.dismiss();
    //     env.nav.setRoot(env.main_page.component);
    //   }, function(err){
    //     console.log("Google Login error", err);
    //   });
    // });
  }


  goToSignup() {
    this.nav.push(SignupPage);
  }

  goToForgotPassword() {
    this.nav.push(ForgotPasswordPage);
  }

}
