import { ApiProvider } from './../../providers/api/api';
import { Component } from '@angular/core';
import { NavController, ModalController, LoadingController } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';

import { TermsOfServicePage } from '../terms-of-service/terms-of-service';
import { PrivacyPolicyPage } from '../privacy-policy/privacy-policy';

import { TabsNavigationPage } from '../tabs-navigation/tabs-navigation';

// import { FacebookLoginService } from '../facebook-login/facebook-login.service';

import * as firebase from 'firebase';

@Component({
  selector: 'signup-page',
  templateUrl: 'signup.html'
})
export class SignupPage {
  signup: FormGroup;
  main_page: { component: any };
  loading: any;

  public hasError: any = false;

  constructor(
    public nav: NavController,
    public modal: ModalController,
    // public facebookLoginService: FacebookLoginService,
    public loadingCtrl: LoadingController,
    public api: ApiProvider,
  ) {
    this.main_page = { component: TabsNavigationPage };

    // formulario de cadastro
    this.signup = new FormGroup({
      email: new FormControl('', Validators.required),
      nome: new FormControl('', Validators.required),
      cidade: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      confirm_password: new FormControl('', Validators.required)
    });
  }

  // faz o cadastro
  public doSignup(){
    // this.nav.setRoot(this.main_page.component);

    // mostra o loading
    const loading = this.loadingCtrl.create( { content: 'Criando conta...' } );
    loading.present();

    // pega os dados do formulário
    const dados = JSON.parse( JSON.stringify( this.signup.value ) );

    // chama o firebase
    firebase.auth().createUserWithEmailAndPassword( dados['email'], dados['password'] )
    .then( user => {

      // seta os dados
      dados['uid'] = user.uid;
      
      // envia o post
      this.api.post( '/cadastrar_usuario', dados )
      .then( dados => {
        console.log( dados );
      })
      .catch( err => {

        // seta o erro
        this.hasError = err;
      })
      .then( () => loading.dismiss() );
    })
    .catch( err => {

      // seta o erro
      this.hasError = err['code'];
      loading.dismiss();
    });
  }

  doFacebookSignup() {
    this.loading = this.loadingCtrl.create();
    // Here we will check if the user is already logged in
    // because we don't want to ask users to log in each time they open the app
    let env = this;

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
    //     env.loading.dismiss();
    //   });
    // });
  }

  showTermsModal() {
    let modal = this.modal.create(TermsOfServicePage);
    modal.present();
  }

  showPrivacyModal() {
    let modal = this.modal.create(PrivacyPolicyPage);
    modal.present();
  }
}
