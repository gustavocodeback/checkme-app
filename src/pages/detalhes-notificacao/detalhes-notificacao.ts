import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'detalhes-notificacao-page',
  templateUrl: 'detalhes-notificacao.html'
})
export class DetalhesNotificacaoPage {
  public notificacao = {};

  constructor(
    public navCtrl: NavController,
    public navParams : NavParams,
  ) {
    this.notificacao = this.navParams.get( 'notificacao' );
  }
}
