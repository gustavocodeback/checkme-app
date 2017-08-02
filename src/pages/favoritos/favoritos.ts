import { ContactCardPage } from './../contact-card/contact-card';
import { CommentsPage } from './../comments/comments';
import { ApiProvider } from './../../providers/api/api';
import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ModalController } from 'ionic-angular';

@Component({
  selector: 'page-favoritos',
  templateUrl: 'favoritos.html',
})
export class FavoritosPage {

  // seta as bandas
  public type: string = 'banda';

  // dados
  public dados = [];

  // se tem mais
  public hasMore = false;

  // se deve mostrar o loading
  public loading = false;

  // método construtor
  public constructor(   public navCtrl: NavController, 
                        public loadingCtrl: LoadingController,
                        public api: ApiProvider,
                        public modal: ModalController,
                        public navParams: NavParams ) {              
  }
  
  // carrega os dados
  public carregar( reset = false ) {

    // verifica se deve resetar
    if ( reset ) this.dados = [];

    // mostra o loading
    this.loading = true;

    // seta a pagina
    const pagina = Math.floor( this.dados.length / 5 ) + 1;

    // chama a api
    this.api.get( `/favoritos/${this.type}/${pagina}` )
    .then( dados => {
      console.log( dados );
      for ( let d in dados ) {
        this.dados.push( dados[d] );

        // verifica se deve ter mais
        if ( this.dados.length < 5 ) {
          this.hasMore = false;
        } else {
          this.hasMore = true;
        }
      }
    })
    .catch( err => console.log( err ) )
    .then( () => this.loading = false );
  }

  // quando a view carregar
  public ionViewDidEnter(){
    this.carregar();
  }

  // quando a tab mudar
  public changeTab() {
    this.carregar( true );
  }

  // favorita um item
  public favoritar( index ) {
    
    // pega a banda
    const banda = this.dados[index];

    // promesa
    let promesa = null;

    // mostra o loading
    const loading = this.loadingCtrl.create( { content: 'Favoritando...' } );
    loading.present();

    // seta a promessa
    if ( !banda.favorito )
      promesa = this.api.get( `/favoritar/${this.type}/${banda.id}` );
    else
      promesa = this.api.get( `/desfavoritar/${this.type}/${banda.id}` );
    
    // chama a promessa
    promesa.then( usr => {
      banda.favorito = !banda.favorito;
      this.dados.splice( index, 1 );
    })
    .then( () => loading.dismiss() );
  }

  // abre a pagina de comentarios
  public comments( valor ) {
    const modal = this.modal.create( CommentsPage, { chave: this.type+'_id', valor } );
    modal.present();
  }

  // abre o card de contato
  public openContactCard( place ) {
    this.navCtrl.push( ContactCardPage, { place: place } );
  }
}
