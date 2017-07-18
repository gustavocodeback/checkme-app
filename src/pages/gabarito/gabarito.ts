import { GabaritoService } from './gabarito.service';
import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';

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

  // método construtor
  constructor(  public navCtrl: NavController, 
                public gabarito: GabaritoService,
                public loadingCtrl: LoadingController,
                public navParams: NavParams) {
    
    // pega o quiz
    this.quiz = this.navParams.get( 'quiz' );
  }

  // obtem a classe
  public getClass( pergunta, alternativa ) {

    // verifica se a alternativa estava correta
    if ( alternativa == pergunta['Resposta'] ) return 'success';
    
    // se o status for false
    if ( !pergunta['Status'] && alternativa == pergunta['Respondida'] ) return 'error';
  }

  // quando a view entrar
  ionViewDidEnter() {

    // cria o loading
    const loading = this.loadingCtrl.create( { content: 'Carregando gabarito...' } );
    loading.present();
    
    // chama a api
    this.gabarito.obterGabarito( this.quiz.CodQuestionario )
    .then( gab => {
      this.perguntas = gab;
    })
    .catch( err => console.log( err ) )
    .then( () => loading.dismiss() );
  }
}
