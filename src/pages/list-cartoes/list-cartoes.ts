import { NavController, LoadingController, NavParams, AlertController } from 'ionic-angular';
import { Component } from '@angular/core';

import 'rxjs/Rx';

import { ListCartoesService } from './list-cartoes.service';

@Component({
  selector: 'list-cartoes-page',
  templateUrl: 'list-cartoes.html'
})
export class ListCartoesPage {
  loading: any;
  public cartoes = [];
  public hasMore = false;

  constructor(
    public nav: NavController,
    public navParams : NavParams,
    public listCartoesService: ListCartoesService,
    public loadingCtrl: LoadingController,
    public alertCtrl : AlertController
  ) {
  }

  // obtem as notificacoes
  public obterCartoes( loader = null ) {

    // cria o loading
    this.loading = this.loadingCtrl.create({ content: 'Carregando Cartões...' });

    // exibe o loading
    this.loading.present();

    // busca as notificacoes
    this.listCartoesService
    .obterCartoes( this.cartoes.length )
    .then( cartoes => {

      // verifica se tem mais notificacoes
      this.hasMore = cartoes.length < 5 ? false : true;

      // percorre as notificacoes e adiciona elas na array
      cartoes.forEach( cartao => {
        if( cartao['Status'] == 'A' ) cartao['Status'] = 'Aberto';
        if( cartao['Status'] == 'U' ) cartao['Status'] = 'Usado';
        if( cartao['Status'] == 'C' ) cartao['Status'] = 'Cancelado';
        if( cartao['Status'] == 'D' ) cartao['Status'] = 'Debitado';
        this.cartoes.push( cartao );
      });
    })
    .catch( err => {
      console.log( err );
    })
    .then( () => {

      if ( loader ) loader.complete();
      this.loading.dismiss();
    })
  }

  // quando a view entrar
  ionViewDidEnter() {
    this.cartoes = [];
    this.obterCartoes();
  }
  
  public novoCartao() {
    let prompt = this.alertCtrl.create({
      title: 'Cartão',
      message: "Insira o código do cartão",
      inputs: [
        {
          name: 'codigo',
          placeholder: 'Código'
        }, {
          name: 'confirmacodigo',
          placeholder: 'Confirmar Código'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Confirmar',
          handler: data => {
            if( data.codigo != data.confirmacodigo ) return this.conclusao( false, 'Codigos não conferem!' )
            this.listCartoesService.usarCartao( data.codigo )
            .then( cartao => {
              if( cartao['status'] == 'A' ) cartao['status'] = 'Aberto';
              else if( cartao['status'] == 'U' ) cartao['status'] = 'Usado';
              else if( cartao['status'] == 'C' ) cartao['status'] = 'Cancelado';
              else if( cartao['status'] == 'D' ) cartao['status'] = 'Debitado';
              else cartao['status'] = '?'
              const novoCartao = {
                CodCartao   : cartao['CodCartao'],
                Codigo      : cartao['codigo'],
                Status      : cartao['status'],
                Valor       : cartao['valor'],
              }
              this.cartoes.push( novoCartao );
              this.conclusao( cartao, 'Cartão inserido com sucesso<br>' )
            }).catch( err => this.conclusao( false, 'Não foi possivel utilizar o cartão no momento.' ) );
          }
        }
      ]
    });
    prompt.present();

  }

  public conclusao( cartao, texto ) {
    let alert = this.alertCtrl.create({
      title: cartao ? 'Sucesso': 'Erro',
      subTitle: !cartao ? texto : texto + 'Cartão: ' + cartao.codigo + ' no valor de R$' + cartao.valor,
      buttons: ['OK']
    });
    alert.present();
  }
}