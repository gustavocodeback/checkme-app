import { ListTreinamentosPage } from './../list-treinamentos/list-treinamentos';
import { RankingService } from './../ranking/ranking.service';
import { ListQuizPage } from './../list-quiz/list-quiz';
import { ListProdutosPage } from './../list-produtos/list-produtos';
import { NotWorkingPage } from './../not-working/not-working';
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

  ionViewDidLoad() {
    this.loading.present();
    this.inicialService
    .getData()
    .then( data => {
      console.log(data);
      this.inicial.banner_image = data.banner_image;
      this.inicial.banner_title = data.banner_title;
      this.inicial.populars = data.populars;
      this.inicial.categories = data.categories;
    });

    this.ranking.obterMinhaPosicao()
    .then( usr => {
      this.pos    = usr.ranking;
      this.pontos = usr.pontos;
    });

    this.inicialService.obterCategorias()
    .then( Categorias => {
      console.log(Categorias);
      this.categorias = Categorias;
    }).catch( err => console.log( err ) )
    .then( () =>    this.loading.dismiss() );

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
