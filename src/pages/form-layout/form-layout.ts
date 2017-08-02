import { ValidateProvider } from './../../providers/validate/validate';
import { PictureProvider } from './../../providers/picture/picture';
import { ApiProvider } from './../../providers/api/api';
import { Component } from '@angular/core';
import { NavController, SegmentButton, AlertController, LoadingController } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { counterRangeValidator } from '../../components/counter-input/counter-input';

@Component({
  selector: 'form-layout-page',
  templateUrl: 'form-layout.html',
  providers: [ PictureProvider ]
})
export class FormLayoutPage {

  // foto do evento
  public foto;

  // erros
  public hasError: any = false;

  // categorias de eventos
  public categorias = [];

  // estabelecimentos
  public locais = [];

  // se o usuario tem estabelecimento
  public mostrar = true;

  // escolheu evento
  public evento = false;

  // formulario
  public form: FormGroup;

  // cidades
  public cidades = [];

  // validate
  public validade: ValidateProvider = new ValidateProvider();

  section: string;

  post_form: any;
  event_form: FormGroup;
  card_form: FormGroup;

  categories_checkbox_open: boolean;
  categories_checkbox_result;

  // método construtor
  constructor(  public nav: NavController, 
                public api: ApiProvider,
                public loadingCtrl: LoadingController,
                public picture: PictureProvider,
                public alertCtrl: AlertController) {
   this.initForm();
  }

  // seta o formulario
  public initForm() {

    // regras de validacao do formulario
    const rules = [
      {
        field: 'local',
        rules: ''
      },{
        field: 'endereco',
        rules: ''
      },{
        field: 'cidade',
        rules: ''
      },{
        field: 'contato',
        rules: ''
      }, {
        field: 'categoria',
        rules: 'required'
      }, {
        field: 'nome',
        rules: 'required'
      }, {
        field: 'desc',
        rules: 'required'
      }, {
        field: 'data',
        rules: 'required'
      }, {
        field: 'hora',
        rules: 'required'
      }
    ];

    // seta o formulario
    this.form = this.validade.set_form( rules );
  }

  // carrega os dados
  public loadData() {

    // chama a api
    this.api.get( '/categorias' )
    .then( cat => {
      console.log( cat );
      this.categorias = cat; 
    })
    .catch( err => console.log( err ) );

    // chama a api
    this.api.get( '/obter_cidades' )
    .then( cat => {
      console.log( cat );
      this.cidades = cat; 
    })
    .catch( err => console.log( err ) );

    // pega os locais
    this.api.get( '/meus_locais' )
    .then( cat => {
      console.log( cat );
      this.locais = cat; 

      // seta o mostrar
      if ( cat.length == 0 ) 
        this.mostrar = true;
      else 
        this.mostrar = false;
    })
    .catch( err => console.log( err ) );
  }

  // carrega a foto
  public getPic() {
    this.picture.get()
    .then( pic => {

      // seta a foto
      this.foto = pic;
    })
    .catch( err => {

      // seta a foto
      this.foto = null;
    });
  }

  // quando entrar na view
  public ionViewDidEnter(){
   
    // carrega os dados
    this.loadData();
  }

  // envia o evento
  public enviarEvento() {

    // mostra o loading
    let loader = this.loadingCtrl.create({
      content: "Enviando evento...",
    });
    loader.present();

    // verifica se o formulário é valido
    if ( this.form.valid ) {

      // pega os dados do formulário
      const data = JSON.parse( JSON.stringify( this.form.value ) );

      // verifica se existe uma foto
      if ( this.foto ) data['foto'] = this.foto;

      // faz o cadastro
      this.api.post( '/criar_evento', data )
      .then( success => {
        loader.dismiss();
        this.nav.pop();
      })
      .catch( err => {
        this.hasError = err;
        loader.dismiss();
      })
    } else loader.dismiss();
  }
}
