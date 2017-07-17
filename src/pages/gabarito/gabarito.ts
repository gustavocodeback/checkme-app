import { GabaritoService } from './gabarito.service';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-gabarito',
  templateUrl: 'gabarito.html',
  providers: [ GabaritoService ]
})
export class GabaritoPage {

  // quiz
  public quiz;

  // perguntas
  public perguntas = [];

  constructor(  public navCtrl: NavController, 
                public gabarito: GabaritoService,
                public navParams: NavParams) {
    
    // pega o quiz
    this.quiz = this.navParams.get( 'quiz' );
    console.log( this.quiz );
  }

  ionViewDidEnter() {
    this.gabarito.obterGabarito( this.quiz.CodQuestionario )
    .then( gab => this.perguntas = gab )
    .catch( err => console.log( err ) );
  }
}
