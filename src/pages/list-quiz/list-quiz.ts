import { NavController, LoadingController, NavParams } from 'ionic-angular';
import { DetalhesQuizPage } from './../detalhes-quiz/detalhes-quiz';
import { ListQuizService } from './list-quiz.service';
import { Component } from '@angular/core';
import 'rxjs/Rx';

@Component({
  selector: 'list-quiz-page',
  templateUrl: 'list-quiz.html',
  providers: [ ListQuizService ]
})
export class ListQuizPage {

  // questionarios
  public questionarios = [];

  // se existem mais registros
  public hasMore = false;

  // metodo construtor
  constructor(
    public nav: NavController,
    public navParams : NavParams,
    public listQuizService: ListQuizService,
    public loadingCtrl: LoadingController
  ) {}

  // obtem os questionarios
  public obterQuestionarios( loader = null ) {

    // seta o loading
    let loading = null;

    // mostra o loading
    if ( !loader ) {
      loading = this.loadingCtrl.create({ content: 'Carregando Questionários...' });
      loading.present();
    }
    
    // obtem os questionarios
    this.listQuizService
    .obterQuestionarios( this.questionarios.length )
    .then( produtos => {
      this.hasMore = produtos.length < 5 ? false : true;
      produtos.forEach( produto => this.questionarios.push( produto ) );
    })
    .catch( err => {
      console.log( err );
    })
    .then( () => {

      // esconde o loading
      if ( loader ) loader.complete();
      else loading.dismiss();
    })
  }

  ionViewDidLoad() {
    this.obterQuestionarios();
  }

  public openQuiz( quiz ) {
    this.nav.push( DetalhesQuizPage, { quiz } );
  }
}