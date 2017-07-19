import { RankingService } from './../ranking/ranking.service';
import { ExtratoService } from './extrato.service';
import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';

@Component({
  selector: 'page-extrato',
  templateUrl: 'extrato.html',
  providers: [ ExtratoService, RankingService ]
})
export class ExtratoPage {

  // lista do extrato
  public extratos = new Array();

  // pontos
  public pontos;

  // se tem mais
  public hasMore = false;

  // loading
  public loading = false;

  // método construtor
  constructor(  public navCtrl: NavController, 
                public extrato: ExtratoService,
                public Ranking: RankingService,
                public loadingCtrl: LoadingController,
                public navParams: NavParams) {
  }

  // obtem o extrato
  public obterExtrato( loader = false ) {
    
    // loading
    let loading = null;

    // verifica se existe o loader
    if ( !loader ) {
      loading = this.loadingCtrl.create( { content: 'Carregando extrato ...' } );
      loading.present();
    } else {
      this.loading = true;
    }

    // calcula a pagina
    const page = this.extratos.length == 0 ? 1 : Math.floor( this.extratos.length / 10 ) + 1;

    // chama a api
    this.extrato.obterExtrato( page )
    .then( extrato => {

      // adiciona na lista
      for( let e in extrato ) {
        this.extratos.push( extrato[e] );
      }

      // verifica se existe mais
      this.hasMore = false;
      if ( extrato.length >= 10 ) this.hasMore = true;
    })
    .catch( err => console.log( err ) )
    .then( () => {
      if ( !loader ) {
        loading.dismiss();
      } else {
        this.loading = false;
      }
    })
  }

  // quando a view entrar
  ionViewDidEnter() {
    this.obterExtrato();
    this.Ranking.obterMinhaPosicao()
    .then( usr => this.pontos = usr.pontos );
  }
}
