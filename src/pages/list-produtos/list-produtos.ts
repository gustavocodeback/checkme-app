import { NavController, LoadingController, NavParams } from 'ionic-angular';
import { DetalhesProdutoPage } from './../detalhes-produto/detalhes-produto';
import { Component } from '@angular/core';
import { ListProdutosModel } from './list-produtos.model';
import { ListProdutosService } from './list-produtos.service';
import 'rxjs/Rx';

@Component({
  selector: 'list-produtos-page',
  templateUrl: 'list-produtos.html'
})
export class ListProdutosPage {

  // listagem de produtos
  listProdutos: ListProdutosModel = new ListProdutosModel();
  
  // loading
  public loading: any;

  // categoria de filtragem
  public  categoria;

  // listagem de produtos
  public produtos = [];

  // se existem mais registros
  public hasMore = false;

  // metodo construtor
  constructor(
    public nav: NavController,
    public navParams : NavParams,
    public listProdutosService: ListProdutosService,
    public loadingCtrl: LoadingController
  ) {}

  // obtem os produos
  public obterProdutos( loader = null ) {

    // verifica o loader
    if( !loader ){
      this.loading = this.loadingCtrl.create({ content: 'Carregando Produtos...' });
      this.loading.present();
    }

    // listagem de produtos
    this.listProdutosService
    .obterProdutosCategoria( this.categoria.CodCategoria, this.produtos.length )
    .then( produtos => {
      this.hasMore = produtos.length < 5 ? false : true;
      produtos.forEach( produto => this.produtos.push( produto ) );
    })
    .catch( err => {
      console.log( err );
    })
    .then( () => {

      if ( loader ) loader.complete();
      else this.loading.dismiss();
    })
  }

  // quando o video carregar
  ionViewDidLoad() {
    this.categoria = this.navParams.get( 'categoria' );
    this.obterProdutos();
  }

  // verifica se existe detalhes a serem exibidos
  public openProduto( produto ) {
    if( !produto['Video'] && !produto['Descricao'] ) return;
    this.nav.push( DetalhesProdutoPage, { produto } );
  }
}