import { ApiProvider } from './../../providers/api/api';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'detalhes-notificacao-page',
  templateUrl: 'detalhes-notificacao.html'
})
export class DetalhesNotificacaoPage {
  public notificacao = {};

  constructor(
    public navCtrl    : NavController,
    public navParams  : NavParams,
    public api        : ApiProvider
  ) {

    // seta a notificacao
    this.notificacao = this.navParams.get( 'notificacao' );

    // marca a notificacao como lida na api
    this.api.get( '/api/ler_notificacao/' + this.notificacao['CodDisparo'] )
    .then( sucesso => console.log( sucesso ) )
    .catch( err => console.log( err ) );
  }
}
