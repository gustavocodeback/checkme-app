import { SuporteService } from './suporte.service';
import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';

@Component({
  selector: 'page-suporte',
  templateUrl: 'suporte.html',
  providers: [ SuporteService ]
})
export class SuportePage {

  // mensagens enviadas
  public mensagens = [];

  // loading
  public loading = false;

  // se tem mais
  public hasMore = false;

  // mensagem atual
  public mensagem;

  // método construtor
  constructor(  public navCtrl: NavController,
                public suporte: SuporteService,
                public loadingCtrl: LoadingController,
                public navParams: NavParams) {
  }

  // obtem as mensagens enviadas
  public obterMensagens( loader = false ) {

    // cria o loading
    let loading = null;

    // cria o loading
    if ( !loader ) {
      loading = this.loadingCtrl.create( { content: 'Carregando mensagens ...' } );
      loading.present();
    }

    // calcula a pagina
    const page = this.mensagens.length == 0 ? 1 : Math.floor( this.mensagens.length / 5 ) + 1;

    // chama a api
    this.suporte.obterMensagens( page )
    .then( mensagens => {

      // seta as mensagens
      for ( let m in mensagens ) this.mensagens.push( mensagens[m] );

      // verifica se tem mais
      this.hasMore = false;
      if ( mensagens.length >= 5 ) this.hasMore = true;
    })
    .catch( err => console.log( err ) )
    .then( () => {

      // esconde o loading
      if ( !loader ) {
        loading.dismiss();
      } else {
        this.loading = false;
      }
    })
  }

  // quando entrar
  public ionViewDidEnter(){
    this.obterMensagens();
  }

  // envia uma nova mensagem
  public enviar() {

    // faz o trim
    const msg = this.mensagem.trim();

    // verifica o tamanho
    if ( msg.length <= 0 ) return;

    // cria o loading
    const loading = this.loadingCtrl.create( { content: 'Carregando ...' } );
    loading.present();

    // chama a api
    this.suporte.enviarMensagem( msg )
    .then( res => {

      // reseta o array
      this.mensagens = [];
      this.obterMensagens();

    })
    .catch( err => console.log( err ) )
    .then( () => loading.dismiss() );
  }
}
