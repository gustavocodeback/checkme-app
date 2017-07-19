import { NavController, LoadingController, NavParams } from 'ionic-angular';
import { DetalhesProdutoPage } from './../detalhes-produto/detalhes-produto';
import { Component } from '@angular/core';

import 'rxjs/Rx';

import { ListProdutosModel } from './list-produtos.model';
import { ListProdutosService } from './list-produtos.service';

@Component({
  selector: 'list-produtos-page',
  templateUrl: 'list-produtos.html'
})
export class ListProdutosPage {
  listProdutos: ListProdutosModel = new ListProdutosModel();
  loading: any;
  public  categoria;
  public produtos = [];
  public hasMore = false;

  constructor(
    public nav: NavController,
    public navParams : NavParams,
    public listProdutosService: ListProdutosService,
    public loadingCtrl: LoadingController
  ) {
    this.categoria = this.navParams.get( 'categoria' );
  }

  public obterProdutos( loader = null ) {
    this.loading = this.loadingCtrl.create({ content: 'Carregando Produtos...' });
    this.loading.present();
    this.listProdutosService
    .obterProdutosCategoria( this.categoria, this.produtos.length )
    .then( produtos => {
      this.hasMore = produtos.length < 5 ? false : true;
      produtos.forEach( produto => this.produtos.push( produto ) );
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
    this.obterProdutos();
  }

  public openProduto( produto ) {
    if( !produto['Video'] && !produto['Descricao'] ) return;
    this.nav.push( DetalhesProdutoPage, { produto } );
  }
}