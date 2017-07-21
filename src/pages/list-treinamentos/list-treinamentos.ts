import { DetalhesProdutoPage } from './../detalhes-produto/detalhes-produto';
import { NavController, LoadingController, NavParams } from 'ionic-angular';
import { Component } from '@angular/core';

import 'rxjs/Rx';

import { ListTreinamentosService } from './list-treinamentos.service';

@Component({
  selector: 'list-treinamentos-page',
  templateUrl: 'list-treinamentos.html'
})
export class ListTreinamentosPage {
  loading: any;
  public treinamentos = [];
  public hasMore = false;

  constructor(
    public nav: NavController,
    public navParams : NavParams,
    public listTreinamentosService: ListTreinamentosService,
    public loadingCtrl: LoadingController
  ) {
  }

  // obtem as treinamentos
  public obterNotificacoes( loader = null ) {

    // cria o loading
    this.loading = this.loadingCtrl.create({ content: 'Carregando Treinamentos...' });

    // exibe o loading
    this.loading.present();

    // busca as treinamentos
    this.listTreinamentosService
    .obterTreinamentos( this.treinamentos.length )
    .then( treinamentos => {

      // verifica se tem mais treinamentos
      this.hasMore = treinamentos.length < 10 ? false : true;

      // percorre as treinamentos e adiciona elas na array
      treinamentos.forEach( notificacao => this.treinamentos.push( notificacao ) );
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

  public openTreinamento( produto ) {

    // carrega a pagina de detalhes da notificação
    this.nav.push( DetalhesProdutoPage, { produto } );
  }
}