import { PictureProvider } from './../../providers/picture/picture';
import { ApiProvider } from './../../providers/api/api';
import { Component } from '@angular/core';
import { NavController, ModalController, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { FormGroup } from '@angular/forms';
import { TermsOfServicePage } from '../terms-of-service/terms-of-service';
import { PrivacyPolicyPage } from '../privacy-policy/privacy-policy';
import 'rxjs/Rx';

import { ValidateProvider } from './../../providers/validate/validate';
import * as firebase from 'firebase';

@Component({
  selector: 'settings-page',
  templateUrl: 'settings.html',
  providers: [ PictureProvider ]
})
export class SettingsPage {
  
  // formulario
  public form: FormGroup;

  // se a foto foi trocada
  public touched = false;

  // foto
  public pic;

  // validate
  public validade: ValidateProvider = new ValidateProvider();

  //usuario logado
  public user;

  // referencia para o upload
  public storageRef = firebase.storage();

  constructor(
    public nav: NavController,
    public modal: ModalController,
    public loadingCtrl: LoadingController,
    public api: ApiProvider,
    public alertCtrl: AlertController,
    public picProvider: PictureProvider,
    public toastCtrl: ToastController
  ) {
    this.initForm();
    this.user = firebase.auth().currentUser;
    firebase.database().ref( `/usuarios/${this.user.uid}` ).once( 'value' ).then( snap => {
      const val = snap.val();
      this.pic = val['foto'];
    });
  }

  // inicia o formulario
  public initForm() {

    // seta as regras de validacao
    const rules = [
      {
        field: 'email',
        rules: 'required|valid_email'
      }, {
        field: 'nome',
        rules: 'required'
      }, {
        field: 'cidade',
        rules: 'required'
      }, {
        field: 'senha',
        rules: 'maxLength[18]|minLength[6]|matches[novaSenha]' 
      }, {
        field: 'novaSenha',
        rules: 'maxLength[18]|minLength[6]|matches[senha]'
      }
    ];

    // seta o formulario
    this.form = this.validade.set_form( rules );
  };

  // quando a view entrar
  public ionViewDidEnter() {
    
    // exibe o loading
    const loading = this.loadingCtrl.create( { content: 'Carregando perfil...' } );
    loading.present();

    // pega o usuário atual
    const uid = firebase.auth().currentUser.uid;

    // carrega os dados desse usuario
    this.api.get( `/usuario/${uid}` )
    .then( user => {
      this.form.patchValue( user );
    })
    .catch( err => {
      console.log( err );
    })
    .then( () => loading.dismiss() );
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

      // calback do sucesso
      const success: any =() => {

        // envia a url da imagem
        resolve( picRef.snapshot.downloadURL );
      }

      // quando o status mudar
      picRef.on( 'state_changed', ( snapshot ) => {
      }, ( err ) => {

        // envia o erro obtido
        reject( err.message );
      }, success );
    });
  }

  // salva o formulario
  public async salvarDados() {

    // mostra o loading
    const loading = this.loadingCtrl.create( { content: 'Salvando alterações...' } );
    loading.present();

    // pega os dados do formulario
    const dados = JSON.parse( JSON.stringify( this.form.value ) );
    dados['uid'] = firebase.auth().currentUser.uid;

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

    // seta a foto
    firebase.database().ref( `usuarios/${dados['uid']}` ).update({ foto });
    dados['foto'] = foto;
    
    // verifica se houve edicao no email e senha
    if( dados['email'] != this.user['email'] || ( dados['senha'] && dados['novaSenha'] ) ) {

      // verifica a senha
      if ( !dados['email'] || !dados['senha'] || dados['novaSenha'] ) {
        loading.dismiss();
        return this.errToast( 'Existem campos em branco.' );
      }

      // verifica os emails
      if( dados['email'] != this.user['email'] ) 
        dados['email'] = dados['email'];

      // verifica as senhas
      if( dados['senha'].length > 6 && dados['senha'] != dados['novaSenha']) {
        loading.dismiss();
        return this.errToast( 'Senhas não conferem!' );
      }

      // verifica o tamanho da senha
      if( dados['senha'].length > 6 && dados['senha'] == dados['novaSenha']) 
        dados['senha'] = dados['senha'];
      
      // edita os dados de email e senha
      this.editarEmailSenha( dados );
    }

    // chama a api
    this.api.post( '/alterar_usuario', dados )
    .then( ( usr ) => {
      console.log( usr );
    })
    .catch( err => {
      console.log( err );
    })
    .then( () => loading.dismiss() );
  }

  // faz a reauntenticacao
  public reauthenticate( pass:string ) {
    const credentials = firebase.auth.EmailAuthProvider.credential(
        firebase.auth().currentUser.email,
        pass
      );
    return firebase.auth().currentUser.reauthenticateWithCredential( credentials );
  }

  // exibe o toast
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
              this.reauthenticate( data.password ).then( resolve => {
                
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

  // faz o logout
  public logout() {
    
    // limpa o local 
    localStorage.clear();

    // faz o logout
    firebase.auth().signOut();
  }

  // pega uma foto
  public getPic() {

    // pega a foto
    this.picProvider.get()
    .then( pic => {
      this.pic = pic;
      this.touched = true;
    })
    .catch( err => console.log( err ) );
  }

  // mostra o modal
  public showTermsModal() {
    let modal = this.modal.create(TermsOfServicePage);
    modal.present();
  }

  // mostra o modal
  public showPrivacyModal() {
    let modal = this.modal.create(PrivacyPolicyPage);
    modal.present();
  }
}
