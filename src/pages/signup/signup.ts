import { ApiProvider } from './../../providers/api/api';
import { ValidateProvider } from './../../providers/validate/validate';
import { Component } from '@angular/core';
import { NavController, ModalController, LoadingController } from 'ionic-angular';
import { FormGroup } from '@angular/forms';
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

  // estados
  public estados = [];

  // cidades
  public cidades = [];

  // erros no formulario
  public hasError: any = false;  

  public validate: ValidateProvider;

  // método construtor
  constructor(
    public loadingCtrl: LoadingController,
    public modal: ModalController,
    public nav: NavController,
    public auth: AuthProvider,
    public api : ApiProvider
  ) {

    // seta a pagina principal
    this.main_page = { component: TabsNavigationPage };

    // seta o formulario de login
    this.initForm();
  }

  public initForm() {
    
    this.loading = this.loadingCtrl.create( { content : 'Carregando perfil...' } );
    this.loading.present();

    // inicia um novo validator
    this.validate = new ValidateProvider();

    // seta as regras de validacao
    const rules = [
      {
        field: 'email',
        rules: 'required|valid_email'
      }, {
        field: 'cpf',
        rules: 'required|valid_cpf'
      }, {
        field: 'rg',
        rules: 'required'
      }, {
        field: 'cep',
        rules: 'required|maxLength[8]|minLength[8]'
      }, {
        field: 'complemento',
        rules: 'required|maxLength[40]|minLength[5]'
      }, {
        field: 'estado',
        rules: 'required'
      }, {
        field: 'cidade',
        rules: 'required'
      }, {
        field: 'celular',
        rules: 'required|maxLength[11]|minLength[11]'
      }, {
        field: 'numero',
        rules: 'required|maxLength[4]|minLength[2]'
      }, {
        field: 'endereco',
        rules: 'required|maxLength[50]|minLength[6]'
      }, {
        field: 'password',
        rules: 'required|maxLength[18]|minLength[6]|matches[novasenha]' 
      }, {
        field: 'confirm_password',
        rules: 'required|maxLength[18]|minLength[6]|matches[senha]'
      }
    ];

    // busca os estados na api
    this.api.get( '/api/obter_estados/' )
    .then( estados => this.estados = estados )
    .catch( err => console.log( err ) );

    // seta o formulario
    this.signup = this.validate.set_form(rules);

    this.loading.dismiss();
  }

  // busca as cidades quando um estado é selecionado
  public selecionaEstado( CodEstado ) {
    
    // volta para o valor inicial
    this.cidades = [];

    // busca as cidades do estado selecionado na api
    this.api.get( '/api/obter_cidades_estados/' + CodEstado )
    .then( cidades => this.cidades = cidades )
    .catch( err => console.log( err ) );
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
