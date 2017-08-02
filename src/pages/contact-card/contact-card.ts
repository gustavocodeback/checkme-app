import { CommentsPage } from './../comments/comments';
import { EventosPage } from './../eventos/eventos';
import { ListingPage } from './../listing/listing';
import { ApiProvider } from './../../providers/api/api';
import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ModalController } from 'ionic-angular';
import { ContactModel } from './contact.model';

@Component({
  selector: 'contact-card-page',
  templateUrl: 'contact-card.html'
})
export class ContactCardPage {
  contact: ContactModel = new ContactModel();
  
  // lugar no detalhe
  public place = {};

  // mapa
  public map: google.maps.Map;

  constructor(
    public navCtrl: NavController,
    public nav: NavParams,
    public api: ApiProvider,
    public modal: ModalController,
    public loadingCtrl: LoadingController
  ) {

    // pega o id passado
    const place = this.nav.get( 'place' );

    // mostra o loading
    const loading = this.loadingCtrl.create( { content: 'Carregando local...' } );
    loading.present();

    // chama a api
    this.api.get( `/local/${place}` )
    .then( place => {
      this.place = place;
      this.setmap();
    })
    .catch( ( err ) => {
      this.navCtrl.push( ListingPage );
    })
    .then( () => loading.dismiss() );
  }

  call(number: string){}

  // carrega o mapa
  public loadMap( coords ) {
    
    // seta as configurações do mapa
    let mapOptions = {
      center: coords,
      zoom: 17,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true,
    }
    
    // cria o mapa
    let mapEl = document.getElementById('map');
    this.map = new google.maps.Map( mapEl, mapOptions );
    
    // pega a posição do usuáio e coloca no mapa.
    this.map.panTo( coords );
    const marker = new google.maps.Marker({
      position: coords,
      map: this.map,
      animation: google.maps.Animation.DROP,
      title: 'Local!'
    });
  }

  // seta o mapa
  public setmap() {

    // instancia um novo geocoder
    const geocoder = new google.maps.Geocoder();
    const address  = this.place['endereco']+','+this.place['cep'];

    // pega o endereço formatado pela localizacao atual
    geocoder.geocode( { 'address' : address }, ( result, status ) => {

      // verifica se conseguiu obter o endereço
      if ( status == google.maps.GeocoderStatus.OK ) {
        console.log( result[0].geometry.location );
        this.loadMap( result[0].geometry.location );
      }
    });
  }

  // favorita um item
  public favoritar( id ) {

    // promesa
    let promesa = null;

    // mostra o loading
    const loading = this.loadingCtrl.create( { content: 'Favoritando...' } );
    loading.present();

    // seta a promessa
    if ( !this.place['favorito'] )
      promesa = this.api.get( `/favoritar/lugar/${id}` );
    else
      promesa = this.api.get( `/desfavoritar/lugar/${id}` );
    
    // chama a promessa
    promesa.then( usr => {
      this.place['favorito'] = !this.place['favorito'];
    })
    .then( () => loading.dismiss() );
  }

  sendMail(){
    //for more option please go here: http://ionicframework.com/docs/native/email-composer/
     let email = {
      to: 'contact@ionicthemes.com',
      subject: 'This app is the best!',
      body: "Hello, I'm trying this fantastic app that will save me hours of development"
    };
  }

  openInAppBrowser(website: string){}

  // abre a pagina de comentarios
  public comments() {
    const modal = this.modal.create( CommentsPage, { chave: 'lugar_id', valor: this.nav.get( 'place' ) } );
    modal.present();
  }

  // abre os eventos de detalhs
  public abrir() {
    this.navCtrl.push( EventosPage, { local: this.nav.get( 'place' ) } );
  }
}
