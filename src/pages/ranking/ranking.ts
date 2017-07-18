import { AuthProvider } from './../../providers/auth/auth';
import { RankingService } from './ranking.service';
import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import * as firebase from 'firebase';

@Component({
  selector: 'page-ranking',
  templateUrl: 'ranking.html',
  providers: [ RankingService ]
})
export class RankingPage {

  // listagem
  public lista = [];

  // uid
  public uid = firebase.auth().currentUser.uid;

  // tab selecionada
  public tab;

  // minha posicao
  public pos;

  // método construtor
  constructor(  public navCtrl: NavController, 
                public ranking: RankingService,
                public auth: AuthProvider,
                public loadingCtrl: LoadingController,
                public navParams: NavParams) {
  }

  // obtem a foto do usuario
  async obterFoto( user ) {
    const foto = await this.auth.obterFoto( user.cpf );
    user.foto  = foto;
  }

  // obtem o ranking por loja
  public obterRankingLojas() {

    // cria o loading
    const loading = this.loadingCtrl.create( { content: 'Carregando ranking ...' } );
    loading.present();
    
    // chama a api
    this.ranking.obterRankingLoja()
    .then( ranking => {
      this.tab = 'loja';
      this.lista = ranking;
      for ( let l in this.lista ) {
        this.obterFoto( this.lista[l] );
      }
    })
    .then( () => loading.dismiss() );
  }

  // obtem o ranking por cluster
  public obterRankingCluster(){

    // cria o loading
    const loading = this.loadingCtrl.create( { content: 'Carregando ranking ...' } );
    loading.present();
    
    // chama a api
    this.ranking.obterRankingCluster()
    .then( ranking => {
      this.tab = 'cluster';
      this.lista = ranking;
      for ( let l in this.lista ) {
        this.obterFoto( this.lista[l] );
      }
    })
    .then( () => loading.dismiss() );

    // chama a api
    this.ranking.obterMinhaPosicao()
    .then( user => {
      this.pos = user;
      this.obterFoto( this.pos );
      console.log( this.pos );
    })
    .catch( err => console.log( err ) );
  }

  // quando a view entrar
  ionViewDidEnter() {

    // obtem o ranking por loja
    this.obterRankingLojas();
  }
}
