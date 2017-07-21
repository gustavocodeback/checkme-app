import { GabaritoPage } from './../gabarito/gabarito';
import { NavController, NavParams } from 'ionic-angular';
import { ResponderService } from './responder.service';
import { LoadingController } from 'ionic-angular';
import { Component } from '@angular/core';

@Component({
  selector: 'page-responder',
  templateUrl: 'responder.html',
  providers: [ ResponderService ]
})
export class ResponderPage {

  // quiz
  public quiz;

  // perguntas
  public perguntas = [];

  // pergunta atual
  public pergunta = {};

  // texto do botao
  public buttonText = 'Próxima';

  // alternativa selecionada
  public selecionada;

  // index da pergunta
  public index;

  // método construtor
  constructor( public navCtrl: NavController, 
               public navParams: NavParams,
               public loadingCtrl: LoadingController,
               public responderService: ResponderService ) {

    // pega o quiz  
    this.quiz = this.navParams.get( 'quiz' );
    console.log( 'codigo do quiz ', this.quiz );
  }

  // obtem as perguntas do questionarios
  public obterPerguntas() {

    // cria o evento
    const loading = this.loadingCtrl.create( { content: 'Obtendo perguntas' } );
    loading.present();

    // pega as perguntas
    this.responderService.obterPerguntas( this.quiz['CodQuestionario'] )
    .then( perguntas => this.perguntas = perguntas )
    .catch( err => console.log( err ) )
    .then( () => {
      loading.dismiss();

      // seta o index
      this.index = 0;

      // percorre as perguntas
      for ( let p in this.perguntas ) {

        // verifica se a pergunta ja foi respondida
        if ( this.perguntas[p].Respondida ) this.index++;
      }

      // verifica o indice
      if ( this.index == this.perguntas.length ) {
        console.log( 'Quiz respondido por completo' );
        this.encerrar();
      } else {
        this.pergunta = this.perguntas[this.index];
      }
    });
  }

  // quando a view entrar
  ionViewDidEnter() {
    this.obterPerguntas();
  }

  // encerra o quiz
  public encerrar() {

    // mostra o loading
    const loading = this.loadingCtrl.create( { content: 'Encerrando Quiz ...' });
    loading.present();

    // encerra o quiz
    this.responderService.encerrar( this.quiz.CodQuestionario )
    .then( usr => {

      // mostra o gabarito
      this.navCtrl.push( GabaritoPage, { quiz: this.quiz } );
    } )
    .catch( err => {
      
      // mostra o gabarito
      this.navCtrl.push( GabaritoPage, { quiz: this.quiz } );
    })
    .then( () => loading.dismiss() );
  }

  // responde uma pergunta
  public responder() {

    // exibe o loading
    const loading = this.loadingCtrl.create( { content: 'Salvando resposta' } );
    loading.present();

    this.responderService.responder( this.pergunta['CodPergunta'], this.selecionada )
    .then( res => {

      // incrementa o index
      this.index++;

      // verifica se existem mais perguntas
      if ( this.index < this.perguntas.length ) {
        this.pergunta = this.perguntas[this.index];
      } else {
        this.encerrar();
      }

    })
    .catch( err => console.log( err ) )
    .then( () => loading.dismiss() );
  }
}
