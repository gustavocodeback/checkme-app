import { ContactCardPage } from './../contact-card/contact-card';
import { CommentsPage } from './../comments/comments';
import { ApiProvider } from './../../providers/api/api';
import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ModalController } from 'ionic-angular';

@Component({
  selector: 'page-eventos',
  templateUrl: 'eventos.html',
})
export class EventosPage {

  // array de bandas
  public bandas = [];

  // seta o loading
  public loading = false;

  // seta a query
  public query = '';

  // se tem mais
  public hasMore = false;

  // url de busca
  public url: string = 'obter_eventos';

  // método construtor
  constructor(
    public nav: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public api: ApiProvider,
    public modal: ModalController
  ) {

    // verifica se existe um local setado
    if ( this.navParams.get( 'local' ) )
      this.url = 'eventos_lugar/'+this.navParams.get( 'local' );
    
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
    this.api.get( `/${this.url}/${pagina}/${query}` )
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
      promesa = this.api.get( `/favoritar/evento/${banda.id}` );
    else
      promesa = this.api.get( `/desfavoritar/evento/${banda.id}` );
    
    // chama a promessa
    promesa.then( usr => {
      banda.favorito = !banda.favorito;
    })
    .then( () => loading.dismiss() );
  }

  // abre a pagina de comentarios
  public comments( valor ) {
    const modal = this.modal.create( CommentsPage, { chave: 'evento_id', valor } );
    modal.present();
  }

  // abre o card de contato
  public openContactCard( place ) {
    this.nav.push( ContactCardPage, { place: place } );
  }
}
