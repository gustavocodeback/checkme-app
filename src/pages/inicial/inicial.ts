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
})
export class InicialPage {
  inicial: InicialModel = new InicialModel();
  loading: any;

  public categorias = [];

  constructor(
    public nav: NavController,
    public inicialService: InicialService,
    public loadingCtrl: LoadingController,
    public modal: ModalController
  ) {
    this.loading = this.loadingCtrl.create();
  }


  ionViewDidLoad() {
    this.loading.present();
    this.inicialService
    .getData()
    .then( data => {
      this.inicial.banner_image = data.banner_image;
      this.inicial.banner_title = data.banner_title;
      this.inicial.populars = data.populars;
      this.inicial.categories = data.categories;
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
    console.log( categoria );
    this.nav.push( ListProdutosPage, { categoria } );
  }

  // mostra a pagina de funcionalidade nao implementada
  notWorking() {
    const modal = this.modal.create( NotWorkingPage );
    modal.present();
  }

}
