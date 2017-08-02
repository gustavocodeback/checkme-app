import { ApiProvider } from './../../providers/api/api';
import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';

import { FeedPage } from '../feed/feed';
import 'rxjs/Rx';

@Component({
  selector: 'listing-page',
  templateUrl: 'listing.html',
})
export class ListingPage {

  // array com cidades
  public cidades = [];

  // cidade selecionada
  public selecionada = null;

  // filtro
  public query = '';

  constructor(
    public nav: NavController,
    public loadingCtrl: LoadingController,
    public api: ApiProvider
  ) {

    // pega a cidade selecionada
    this.selecionada = localStorage.getItem( 'filter-cidade' );
  }

  // filtra os itens
  public filter() {
    this.cidades = this.cidades.map( ( value ) => {
      if ( value['cidade'].toUpperCase().indexOf( this.query.toUpperCase() ) != -1 ) {
        value['hide'] = false;
      } else {
        value['hide'] = true;
      }
      return value;
    });
  }

  // quando a view carregar
  public ionViewDidLoad() {
    
    // mostra o loading
    const loading = this.loadingCtrl.create( { content: 'Carregando cidades...' } );
    loading.present();

    // chama a api
    this.api.get( '/obter_cidades' )
    .then( cidades => {
      
      // adiciona as cidades
      for ( let c in cidades ) this.cidades.push( cidades[c] );

      // verifica se nao existe cidade selecionada
      if ( !this.selecionada && cidades[0] ) {

        // seta no local storage
        localStorage.setItem( 'filter-cidade',  cidades[0]['id'] );

        // seta na selecionada
        this.selecionada = cidades[0]['id'];
      }
    })
    .catch( err => {
      console.log( err );
    })
    .then( () => loading.dismiss() );
  }

  // seta a cidade selecionada
  public setCidade( id ) {

    // seta no storage
    localStorage.setItem( 'filter-cidade', id );

    // seta a atual
    this.selecionada = id;
  }
}
