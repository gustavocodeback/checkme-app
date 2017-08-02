import { CommentsPage } from './../comments/comments';
import { ApiProvider } from './../../providers/api/api';
import { FormLayoutPage } from './../form-layout/form-layout';
import { Component } from '@angular/core';
import { App, NavParams, LoadingController, NavController, ModalController } from 'ionic-angular';
import * as firebase from 'firebase';
import 'rxjs/Rx';

@Component({
  selector: 'profile-page',
  templateUrl: 'profile.html'
})
export class ProfilePage {

  // se deve mostrar o loading ou nao
  public loading = false;

  // dados do usuario
  public user = {};

  // pega a foto
  public foto = '';

  // eventos carregados
  public eventos = [];

  // se tem mais registros
  public hasMore = false;

  // método construtor
  constructor(
    public app: App,
    public api: ApiProvider,
    public nav: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public modal: ModalController,
  ) {
  }

  // carrega o perfil do usuário
  public perfil() {

    // exibe o loading
    const loading = this.loadingCtrl.create( { content: 'Carregando perfil...' } );
    loading.present();

    // pega o usuário atual
    const uid = firebase.auth().currentUser.uid;

    // carrega os dados desse usuario
    this.api.get( `/usuario/${uid}` )
    .then( user => this.user = user )
    .catch( err => console.log( err ) )
    .then( () => loading.dismiss() );

    // pega a foto do firebase
    firebase.database().ref( `/usuarios/${uid}` ).once( 'value' ).then( snap => {
      const val = snap.val();
      this.foto = val['foto'];
    });
  }

  // carrega os eventos
  public carregar() {

    // mostra o loading
    this.loading = true;

    // seta a pagina
    const pagina = Math.floor( this.eventos.length / 5 ) + 1;

    // chama a api
    this.api.get( `/meus_eventos/${pagina}` )
    .then( eventos => {

      // adiciona os eventos
      for( let e in eventos ) this.eventos.push( eventos[e] );

      // verifica se tem mais
      if ( eventos < 5 ) 
        this.hasMore = true;
      else
        this.hasMore = false;
    })
    .catch( err => console.log( err ) )
    .then( () => this.loading = false );
  }

  // exclui um evento
  public excluir( index ) {

    // pega o evento
    const evento = this.eventos[index];

    // mostra o loading
    const loading = this.loadingCtrl.create( { content: 'Excluindo evento...' } );
    loading.present();

    // chama a api
    this.api.get( `/excluir_evento/${evento['id'] }` )
    .then( () => {

      // remove do array
      this.eventos.splice( index, 1 );
    })
    .catch( err => {
      console.log( err );
    })
    .then( () => loading.dismiss() );
  }

  // quando a view carregar
  public ionViewDidEnter(){

    // reseta o pergil
    this.eventos = [];

    // carrega o perfil
    this.perfil();

    // carrega os eventos
    this.carregar();
  }

  // abre o formulario
  public openNewEvent() {
    this.nav.push( FormLayoutPage );
  }

  // abre a pagina de comentarios
  public comments( valor ) {
    const modal = this.modal.create( CommentsPage, { chave: 'evento_id', valor } );
    modal.present();
  }
}
