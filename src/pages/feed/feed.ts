import { CommentsPage } from './../comments/comments';
import { ApiProvider } from './../../providers/api/api';
import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ModalController } from 'ionic-angular';
import 'rxjs/Rx';

@Component({
  selector: 'feed-page',
  templateUrl: 'feed.html'
})
export class FeedPage {

  // array de bandas
  public bandas = [];

  // seta o loading
  public loading = false;

  // seta a query
  public query = '';

  // se tem mais
  public hasMore = false;

  // método construtor
  constructor(
    public nav: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public modal: ModalController,
    public api: ApiProvider
  ) {
  }

  // carrega dados
  public carregar( reset = false ) {

    // mostra o loading
    this.loading = true;

    // verifica a necessidade de resetar
    if ( reset ) this.bandas = [];

    // seta a página
    const pagina = Math.floor( this.bandas.length / 5 ) + 1;

    // seta a busca
    const query = encodeURI( this.query );

    // chama a api
    this.api.get( `/obter_bandas/${pagina}/${query}` )
    .then( bandas => {

      console.log( bandas );

      // faz o for
      for ( let b in bandas ) this.bandas.push( bandas[b] );

      // verifica se tem mais
      this.hasMore = ( bandas.length < 5 ) ? false : true;

    })
    .catch( err => {
      console.log( err );
    })
    .then( () => {
      this.loading = false;
    })
  }

  // quando a view carregar
  public ionViewDidLoad() {
    this.carregar();
  }

  // favorita um item
  public favoritar( index ) {
    
    // pega a banda
    const banda = this.bandas[index];

    // promesa
    let promesa = null;

    // mostra o loading
    const loading = this.loadingCtrl.create( { content: 'Favoritando...' } );
    loading.present();

    // seta a promessa
    if ( !banda.favorito )
      promesa = this.api.get( `/favoritar/banda/${banda.id}` );
    else
      promesa = this.api.get( `/desfavoritar/banda/${banda.id}` );
    
    // chama a promessa
    promesa.then( usr => {
      banda.favorito = !banda.favorito;
    })
    .then( () => loading.dismiss() );
  }

  // abre a pagina de comentarios
  public comments( valor ) {
    const modal = this.modal.create( CommentsPage, { chave: 'banda_id', valor } );
    modal.present();
  }
}
