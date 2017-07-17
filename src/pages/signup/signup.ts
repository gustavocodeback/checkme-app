import { Component } from '@angular/core';
import { NavController, ModalController, LoadingController } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { TermsOfServicePage } from '../terms-of-service/terms-of-service';
import { PrivacyPolicyPage } from '../privacy-policy/privacy-policy';
import { TabsNavigationPage } from '../tabs-navigation/tabs-navigation';
import { AuthProvider } from '../../providers/auth/auth';

@Component({
  selector: 'signup-page',
  templateUrl: 'signup.html',
  providers: [ AuthProvider ]
})
export class SignupPage {

  // formulario de cadastro
  public signup: FormGroup;

  // pagina principal
  public main_page: { component: any };

  // loading
  public loading: any;

  // erros no formulario
  public hasError: any = false;

  // método construtor
  constructor(
    public loadingCtrl: LoadingController,
    public modal: ModalController,
    public nav: NavController,
    public auth: AuthProvider
  ) {

    // seta a pagina principal
    this.main_page = { component: TabsNavigationPage };

    // seta o formulario de login
    this.signup = new FormGroup({
      cpf: new FormControl( '', Validators.required ),
      email: new FormControl( '', Validators.required ),
      password: new FormControl( '', Validators.required ),
      confirm_password: new FormControl( '', Validators.required )
    });
  }

  // faz o signup
  public doSignup(){
    
    // cria o loading
    const loading = this.loadingCtrl.create( { content: 'Criando conta ...' } );
    loading.present();

    // pega os dados do formulario
    const dados = JSON.parse( JSON.stringify( this.signup.value ) );

    // faz o cadastro
    this.auth.signup( dados )
    .then( usr => {
      this.auth.login( dados );
    })
    .catch( err => {
      this.hasError = err;
    })
    .then( () => loading.dismiss() );
  }

  // mostra o modal dos termos
  showTermsModal() {
    let modal = this.modal.create(TermsOfServicePage);
    modal.present();
  }

  // mostra o modal de privacidade
  showPrivacyModal() {
    let modal = this.modal.create(PrivacyPolicyPage);
    modal.present();
  }
}
