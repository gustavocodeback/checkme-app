import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'detalhes-produto-page',
  templateUrl: 'detalhes-produto.html'
})
export class DetalhesProdutoPage {
  public produto = {};

  constructor(
    public navCtrl: NavController,
    public navParams : NavParams,
  ) {
    this.produto = this.navParams.get( 'produto' );
  }
}
