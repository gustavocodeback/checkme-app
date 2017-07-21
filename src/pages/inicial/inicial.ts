import { ListTreinamentosPage } from './../list-treinamentos/list-treinamentos';
import { RankingService } from './../ranking/ranking.service';
import { ListQuizPage } from './../list-quiz/list-quiz';
import { ListProdutosPage } from './../list-produtos/list-produtos';
import { Component } from '@angular/core';
import { NavController, LoadingController, ModalController } from 'ionic-angular';
import 'rxjs/Rx';
import { InicialModel } from './inicial.model';
import { InicialService } from './inicial.service';

@Component({
  selector: 'inicial-page',
  templateUrl: 'inicial.html',
  providers: [ RankingService ]
})
export class InicialPage {
  inicial: InicialModel = new InicialModel();
  loading: any;

  public loadingCatergorias = false;

  public loadingSquares = false;

  // cateogorias
  public categorias = [];

  // posicao
  public pos;

  // pontos
  public pontos;

  // método construtor
  constructor(
    public nav: NavController,
    public inicialService: InicialService,
    public loadingCtrl: LoadingController,
    public modal: ModalController,
    public ranking: RankingService
  ) {
    this.loading = this.loadingCtrl.create();
  }

  // quando carregar
  ionViewDidLoad() {
    

    // mostra o loading
    this.loadingSquares = true;

    // chama a api
    this.inicialService
    .getData()
    .then( data => {
      this.inicial.categories = data.categories;
    })
    .then( () => this.loadingSquares = false );

    this.ranking.obterMinhaPosicao()
    .then( usr => {
      this.pos    = usr.ranking;
      this.pontos = usr.pontos;
    });

    // exibe o loading
    this.loadingCatergorias = true;

    this.inicialService.obterCategorias()
    .then( Categorias => this.categorias = Categorias )
    .catch( err => console.log( err ) )
    .then( () => this.loadingCatergorias = false );
  }

  // abre a listagem de produtos
  openProdutosList( categoria ) {
    let cat = {};
    for( let categoriaObj of this.categorias ) {
      if( categoriaObj.CodCategoria == categoria ) cat = categoriaObj;      
    }
    this.nav.push( ListProdutosPage, { 'categoria' : cat } );
  }

  // mostra a listagem de questionarios
  openPage( page ) {

    // paginaes
    const pages = {
      'ListTreinamentosPage': ListTreinamentosPage,
      'ListQuizPage' : ListQuizPage
    };

    // pagina atual
    page = pages[page];

    // abre a pagina
    this.nav.push( page );
  }
}
