import { TabsNavigationPage } from './../tabs-navigation/tabs-navigation';
import { FormGroup } from '@angular/forms';
import { ApiProvider } from './../../providers/api/api';
import { AuthProvider } from './../../providers/auth/auth';
import { ValidateProvider } from './../../providers/validate/validate';
import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ModalController } from 'ionic-angular';
import firebase from 'firebase';

/**
 * Generated class for the DadosModalPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-dados-modal',
  templateUrl: 'dados-modal.html',
})
export class DadosModalPage {

  public uid;
  
  // formulario de cadastro
  public dados: FormGroup;

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
    public navParams : NavParams,
    public auth: AuthProvider,
    public api : ApiProvider
  ) {

    // seta o formulario de login
    this.initForm( this.navParams.get( 'edita' ) );
  }

  public initForm( edicao ) {
    
    this.loading = this.loadingCtrl.create( { content : 'Carregando perfil...' } );
    this.loading.present();

    this.uid = firebase.auth().currentUser.uid;

    // inicia um novo validator
    this.validate = new ValidateProvider();

    // seta as regras de validacao
    const rules = [
      {
        field: 'rg',
        rules: 'required'
      }, {
        field: 'cep',
        rules: 'required|maxLength[8]|minLength[8]'
      }, {
        field: 'complemento',
        rules: 'maxLength[40]|minLength[3]'
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
      }
    ];

    // busca os estados na api
    this.api.get( '/api/obter_estados/' )
    .then( estados => this.estados = estados )
    .catch( err => console.log( err ) );

    if( edicao ){

      this.api.get( '/api/obter_funcionario' )
      .then( func => {
      
        // carrega cidades
        this.selecionaEstado( func['estado'] );

        // preenche o formulario
        this.dados.patchValue({
          rg          : func['rg'],
          cep         : func['cep'],
          complemento : func['complemento'],
          estado      : func['estado'],
          cidade      : func['cidade'],
          celular     : func['celular'],
          numero      : func['numero'],
          endereco    : func['endereco'],
        });
        this.loading.dismiss();
      }).catch( err => console.log( err ) );
    } else {
      this.loading.dismiss();
    }

    // seta o formulario
    this.dados = this.validate.set_form(rules);
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
  public salvarDados(){
    
    // cria o loading
    const loading = this.loadingCtrl.create( { content: 'Salvando conta ...' } );
    loading.present();

    // pega os dados do formulario
    const dados = JSON.parse( JSON.stringify( this.dados.value ) );

    this.api.post( `/api/salvar_dados`, {
          uid         : this.uid,
          endereco    : dados['endereco'],
          numero      : dados['numero'],
          celular     : dados['celular'],
          cep         : dados['cep'],
          complemento : dados['complemento'],
          estado      : dados['estado'],
          cidade      : dados['cidade'],
          rg          : dados['rg']
        }).then( sucesso => {

          this.nav.setRoot( TabsNavigationPage );
        }).catch( err => console.log( err ) )
        .then( () => loading.dismiss() );
  }
}
