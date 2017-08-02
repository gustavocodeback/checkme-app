import { ApiProvider } from './../../providers/api/api';
import { ContactCardPage } from './../contact-card/contact-card';
import { NavController, LoadingController, NavParams } from 'ionic-angular';
import { Component } from '@angular/core';
import { List1Service } from './list-1.service';

@Component({
  selector: 'list-1-page',
  templateUrl: 'list-1.html'
})
export class List1Page {

  // lista de comercios
  public comercios = [];

  // pesquisa
  public query = '';

  // se existem mais
  public hasMore = false;

  // se deve exibir o loading
  public loading = false;

  // tipo de busca
  public tipo = 'estabelecimentos';

  // seta o title
  public title = 'Comércio';

  // método construtor
  constructor(
    public nav: NavController,
    public list1Service: List1Service,
    public loadingCtrl: LoadingController,
    public api: ApiProvider,
    public navParams: NavParams
  ) {
    this.tipo = this.navParams.get( 'tipo' );
    if ( this.tipo == 'estabelecimentos' ) {
      this.title = 'Comércio';
    } else {
      this.title = 'Turismo';
    }
  }

  // carrega mais dados
  public carregar( reset = false ) {

    // calcula a paina
    const pagina = Math.floor( this.comercios.length / 5 ) + 1;

    // mostra o loading
    this.loading = true;

    // verifica se deve resetar
    if ( reset ) this.comercios = [];

    // seta a url
    const url = encodeURI( this.query );

    // faz a busca
    this.api.get( `/locais/${this.tipo}/${pagina}/${url}` )
    .then( comercios => {
      console.log( comercios );
      for( let c in comercios ) {
        this.comercios.push( comercios[c] );
      }

      // verifica se tem mais
      if ( comercios.length < 5 ) {
        this.hasMore = false;
      } else {
        this.hasMore = true;
      }
    })
    .catch( err => {
      console.log( err );
    })
    .then( () => this.loading = false );
  }

  // quando entrar na view
  public ionViewDidLoad() {
    this.carregar();
  }

  // abre o card de contato
  public openContactCard( place ) {
    this.nav.push( ContactCardPage, { place: place['id'] } );
  }
}
