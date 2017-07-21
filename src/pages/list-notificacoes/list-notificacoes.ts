import { DetalhesNotificacaoPage } from './../detalhes-notificacao/detalhes-notificacao';
import { NavController, LoadingController, NavParams } from 'ionic-angular';
import { Component } from '@angular/core';

import 'rxjs/Rx';

import { ListNotificacoesService } from './list-notificacoes.service';

@Component({
  selector: 'list-notificacoes-page',
  templateUrl: 'list-notificacoes.html'
})
export class ListNotificacoesPage {
  loading: any;
  public notificacoes = [];
  public hasMore = false;

  constructor(
    public nav: NavController,
    public navParams : NavParams,
    public listNotificacoesService: ListNotificacoesService,
    public loadingCtrl: LoadingController
  ) {
  }

  // obtem as notificacoes
  public obterNotificacoes( loader = null ) {

    // cria o loading
    this.loading = this.loadingCtrl.create({ content: 'Carregando Notificações...' });

    // exibe o loading
    this.loading.present();

    // busca as notificacoes
    this.listNotificacoesService
    .obterNotificacoes( this.notificacoes.length )
    .then( notificacoes => {

      // verifica se tem mais notificacoes
      this.hasMore = notificacoes.length < 10 ? false : true;

      // percorre as notificacoes e adiciona elas na array
      notificacoes.forEach( notificacao => this.notificacoes.push( notificacao ) );
    })
    .catch( err => {
      console.log( err );
    })
    .then( () => {

      if ( loader ) loader.complete();
      this.loading.dismiss();
    })
  }

  // quando a view entrar
  ionViewDidEnter() {
    this.notificacoes = [];
    this.obterNotificacoes();
  }

  // abre a notificacao
  public openNotificacao( notificacao ) {

    // carrega a pagina de detalhes da notificação
    this.nav.push( DetalhesNotificacaoPage, { notificacao } );
  }
}