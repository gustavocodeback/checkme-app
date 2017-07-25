import { DadosModalPage } from './../dados-modal/dados-modal';
import { PictureProvider } from './../../providers/picture/picture';
import { ValidateProvider } from './../../providers/validate/validate';
import { AuthProvider } from './../../providers/auth/auth';
import { Component } from '@angular/core';
import { NavController, ModalController, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { FormGroup } from '@angular/forms';

import { TermsOfServicePage } from '../terms-of-service/terms-of-service';
import { PrivacyPolicyPage } from '../privacy-policy/privacy-policy';

import { HomePage } from '../home/home';

import firebase from 'firebase';

import 'rxjs/Rx';

@Component({
  selector: 'perfil-page',
  templateUrl: 'perfil.html'
})
export class PerfilPage {
  
  public perfilForm: FormGroup;

  // make HomePage the root (or first) page
  public rootPage: any = HomePage;
  public loading: any;

  public user = {};

  public pic: any = 'assets/images/avatar.png';
  
  public touched = false;

  public dPic = 'assets/images/avatar.png';

  public validate: ValidateProvider;
  
  // referencia para o upload
  public storageRef = firebase.storage();

  constructor(
    public nav: NavController,
    public modal: ModalController,
    public loadingCtrl: LoadingController,
    public auth : AuthProvider,
    public picProvider : PictureProvider,
    public toastCtrl : ToastController,
    public alertCtrl : AlertController
  ) {
    this.initForm();
  }

public initForm() {
    
    this.loading = this.loadingCtrl.create( { content : 'Carregando perfil...' } );
    this.loading.present();

    // inicia um novo validator
    this.validate = new ValidateProvider();

    const uid = firebase.auth().currentUser.uid;

    // seta as regras de validacao
    const rules = [
      {
        field: 'email',
        rules: 'required|valid_email'
      }, {
        field: 'nome',
        rules: 'required'
      }, {
        field: 'cargo',
        rules: 'required'
      }, {
        field: 'loja',
        rules: 'required'
      }, {
        field: 'cluster',
        rules: 'required'
      }, {
        field: 'senha',
        rules: 'maxLength[18]|minLength[6]|matches[novasenha]' 
      }, {
        field: 'novasenha',
        rules: 'maxLength[18]|minLength[6]|matches[senha]'
      }
    ];

    // seta o formulario
    this.perfilForm = this.validate.set_form(rules);

    // pega o usuario atual
    this.auth.obterUsuarioPorUid( uid )
    .then( user => {
      this.user = user;
      this.user['email'] = firebase.auth().currentUser.email;

      // seta a foto
      this.pic = user['foto'] ? user['foto'] : null;

      // preenche o formulario
      this.perfilForm.patchValue({
        email       : this.user['email'],
        nome        : this.user['nome'],
        loja        : localStorage.getItem('loja'),
        cluster     : localStorage.getItem('cluster'),
        cargo       : localStorage.getItem('cargo'),
        senha       : '',
        novasenha   : ''
      });
      
      this.loading.dismiss();
    }).catch( err => console.log( err ) );

  }

  // faz o upload de uma foto
  public upload( file ) {

    // gera um nome aleatorio para a foto
    file = file.substr( 23, file.length );
    const picRef = this.storageRef.ref( 'clientes/' )
                  .child( `${this.user['cpf']}.jpg`)
                  .putString( file, 'base64', {contentType: 'image/png'});
    
    // volta uma nova promessa
    return new Promise( ( resolve, reject ) => {

      // quando o status mudar
      picRef.on( 'state_changed', ( snapshot ) => {
      }, ( err ) => {

        // envia o erro obtido
        reject( err.message );
      }, () => {

        // envia a url da imagem
        resolve( picRef.snapshot.downloadURL );
      });
    });
  }

  public async salvar() {

    // mostra o loading
    this.loading = this.loadingCtrl.create( { content : 'Salvando perfil...' } );
    this.loading.present();

    // pega os dados do formulario
    const data = JSON.parse(JSON.stringify(this.perfilForm.value));

    // seta a foto
    let foto = this.pic;

    // verifica se existe uma imagem e se a mesma foi tocada
    if ( this.pic && this.touched ) {
      try {
        foto = await this.upload( this.pic );
      } catch ( error ) {
        console.log( error );
      }
    }

    if( data['email'] != this.user['email'] || data['senha'] != '' ){
      let dados = {};

      if( data['email'] != this.user['email'] ) dados['email'] = data['email'];

      if( data['senha'].length > 6 && data['senha'] != data['novasenha']) {
        this.errToast( 'Senhas não conferem!' );
        return;
      }

      if( data['senha'].length > 6 && data['senha'] == data['novasenha']) dados['senha'] = data['senha'];
      
      this.editarEmailSenha( dados );
    }

    // faz o update do cliente
    firebase.database().ref(`usuarios/${this.user['cpf']}`).update({
      nome: data['nome'],
      foto: foto
    })
    .then(response => {
      this.loading.dismiss();
      this.presentToast();
    })
    .catch(err => {
      console.log(err);
    })
    .then(() => { this.loading = false });
  }

  public presentToast() {
    let toast = this.toastCtrl.create({
      message: 'Alterações salvas com sucesso',
      duration: 3000,
      position: 'middle'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

  public errToast( erro ) {
    let toast = this.toastCtrl.create({
      message: erro,
      duration: 3000,
      position: 'middle'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

  public updatePic() {
    this.pic = this.dPic;
  }

  public getPic() {

    this.picProvider.get()
    .then( pic => {
      this.pic = pic;
      this.touched = true;
    })
    .catch( err => console.log( err ) );
  }

  logout() {
    // navigate to the new page if it is not the current page
    this.nav.setRoot(this.rootPage);
  }

  showTermsModal() {
    let modal = this.modal.create(TermsOfServicePage);
    modal.present();
  }

  showPrivacyModal() {
    let modal = this.modal.create(PrivacyPolicyPage);
    modal.present();
  }

  // metodo para habilitar a edicao de uma transacao
  public editarEmailSenha( dados ) {

      // cria o alert para confirmacao de senha
      let alert = this.alertCtrl.create({

        // titulo do alert
        title: 'Reautenticação',

        // mensagem a ser exibida
        message: 'Digite sua senha',

        // input da senha
        inputs: [
          {
            name: 'password',
            placeholder: '******',
            type: 'password'
          }
        ],

        // botoes
        buttons: [

          // cancelar
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: data => {
              console.log('Cancel clicked');
            }
          },
          
          // confirmar
          {
            text: 'Confirmar',
            handler: data => {

              // chama a funcao para reautenticar o usuario
              this.auth.reauthenticate( data.password ).then( resolve => {
                
              if( dados['email'] )
                firebase.auth().currentUser.updateEmail( dados['email'] );

              if( dados['senha'] )
                firebase.auth().currentUser.updatePassword( dados['senha'] );

                // seta como verdadeiro a edicao da transacao caso a senha esteja certa
                return true;
              }).catch( reject =>{
                this.errToast( 'Senha inválida!' );
                // retorna false caso tenha algum erro
                return false;
              });
            }
          }
        ]
    });

    // mostra o alert
    alert.present();
    return false;
  }

  public showDados() {
    this.nav.push( DadosModalPage, { edita : true } );
  }
}
