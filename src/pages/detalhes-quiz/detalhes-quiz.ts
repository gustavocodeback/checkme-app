import { GabaritoPage } from './../gabarito/gabarito';
import { ResponderPage } from './../responder/responder';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'detalhes-quiz-page',
  templateUrl: 'detalhes-quiz.html'
})
export class DetalhesQuizPage {

  // quiz
  public quiz = {};

  // método construtor
  constructor(
    public navCtrl: NavController,
    public navParams : NavParams,
  ) {
    this.quiz = this.navParams.get( 'quiz' );
  }

  // abre a pagina de responder
  public responder() {
    this.navCtrl.push( ResponderPage , { quiz: this.quiz } );
  }

  // abre a pagina de gabarito
  public verGabarito() {
    this.navCtrl.push( GabaritoPage , { quiz: this.quiz } );    
  }
}
