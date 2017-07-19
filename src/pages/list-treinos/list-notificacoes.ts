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

  public obterNotificacoes( loader = null ) {
    this.loading = this.loadingCtrl.create({ content: 'Carregando Notificações...' });
    this.loading.present();
    this.listNotificacoesService
    .obterNotificacoes( this.notificacoes.length )
    .then( notificacoes => {
      this.hasMore = notificacoes.length < 10 ? false : true;
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

  ionViewDidLoad() {
    this.obterNotificacoes();
  }

  public openProduto( notificacao ) {
    console.log(notificacao);
    this.nav.push( DetalhesNotificacaoPage, { notificacao } );
  }
}