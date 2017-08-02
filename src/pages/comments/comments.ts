import { ApiProvider } from './../../providers/api/api';
import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ViewController } from 'ionic-angular';
import * as firebase from 'firebase';

@Component({
  selector: 'page-comments',
  templateUrl: 'comments.html',
})
export class CommentsPage {

  // texto do comentario
  public text: string = '';

  // comentarios
  public comments = [];

  // usuario
  public user = {};

  // foto
  public foto = '';

  // seta a chave
  public chave = null;

  // seta o valor
  public valor = null;

  constructor(  public navCtrl: NavController, 
                public api: ApiProvider,
                public loadingCtrl: LoadingController,
                public viewCtrl: ViewController,
                public navParams: NavParams ) {
    
    // carrega o perfil
    this.perfil();

    // pega os parametros
    this.chave = this.navParams.get( 'chave' );
    this.valor = this.navParams.get( 'valor' );

    // carrega os comentarios
    this.carregar();
  }

  // fecha o modal
  public close() {
    this.viewCtrl.dismiss();
  }

  // carrega os comentario antigos
  public carregar() {

    // chama a api
    this.api.get( `/comentarios/${this.chave}/${this.valor}` )
    .then( comentarios => {
      console.log( comentarios );
      for ( let c in comentarios ) this.comments.push( comentarios[c] );
    })
    .catch( err => console.log( err ) );
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

  // envia o comentario
  public send() {

    // aplica o trim no texto do comentario
    const text = this.text.trim();

    // verifca se o comentario tem mais de tres caracteres
    if ( text.length > 3 ) {

      // pega os dados do comentario
      const data = {};
      data['mensagem'] = text;
      data[this.chave] = this.valor;

      // envia o comentario
      this.api.post( '/comentar', data )
      .then( resposta => {
        const comment = {
          nome: this.user['nome'],
          foto: this.foto,
          mensagem: data['text']
        }
        this.comments.push( comment );
        this.text = '';
      })
      .catch( err => {
        console.log( err );
      });
    }
  }
}
