import { ApiProvider } from './../api/api';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

@Injectable()
export class AuthProvider {

  public credentials;

  // seta o metodo construtor
  public constructor( public api: ApiProvider ) {}

  // faz o logout
  public logout() {
    localStorage.clear();
    return firebase.auth().signOut();
  }

  // obtem o usuario pelo cpf
  public obterUsuarioPorCpf( cpf ) {
    return firebase.database().ref( `/usuarios/${cpf}` ).once( 'value' );
  }

  // obtem o usuario pelo uid
  public obterUsuarioPorUid( uid ) {
    return new Promise( ( resolve, reject ) => {
      firebase.database().ref( '/usuarios' ).orderByChild( 'uid' ).equalTo( uid ).once( 'value' )
      .then( snap => {

        // pega o usuario
        let usr = snap.val();

        // verifica se o mesmo existe
        if ( usr ) {
          for ( let u in usr ) {
            usr['cpf'] = u;

            // seta as propriedades
            for ( let p in usr[u] ) usr[p] = usr[u][p];
          }
          resolve( usr );
        } else {
          reject( null );
        }
      })
      .catch( err => reject( err ) );
    });
  }

  // preenche o uid do usuario
  public setUid( uid ) {

    // retorna a promessa
    return new Promise( async ( resolve, reject ) => {

      try {

        // pega o usuario
        const user = await this.obterUsuarioPorUid( uid );
        
        // prepara os dados que vao ser enviados
        const dados = { email: user['email'], uid, cpf: user['cpf'] };

        // chama a api
        this.api.post( `/api/salvar_uid/${user['cpf']}`, dados )
        .then( res => {
          console.log(res);
          // verifica se o nome já esta setado
          if( !user['nome'] ) {
            user['nome'] = res['nome'];
            firebase.database().ref( '/usuarios/' + user['cpf'] ).update( { nome : res['nome'] } );
          }

          // grava no local storage
          localStorage.setItem( 'auth-email', user['email'] );
          localStorage.setItem( 'auth-uid', uid );
          localStorage.setItem( 'cargo', res['cargo'] );
          localStorage.setItem( 'loja', res['loja'] );
          localStorage.setItem( 'cluster', res['cluster'] );

          // da resolve no usuario
          resolve( user );
        })
        .catch( err => {
          console.log( err );
        });
      } catch ( error ) {
        reject( error );
      }
    });
  }

  // faz o login
  public async login( dados ) {

    // pega o usuario pelo cpf
    let user = await this.obterUsuarioPorCpf( dados['cpf'] );
    user = user.val();

    // retorna a promessa
    return new Promise( ( resolve, reject ) => {

      // verifica se existe o usuario
      if ( !user ) {
        reject( 'auth/invalid_cpf' );
        return;
      }

      firebase.auth()
      .signInWithEmailAndPassword( dados['email'], dados['password'] ).then( user => {
        resolve( user );
      })
      .catch( err => reject( err['code'] ) );
    });
  }

  // faz o cadastro
  public async signup( dados ) {

    // pega o usuario pelo cpf
    let user = await this.obterUsuarioPorCpf( dados['cpf'] );
    user = user.val();

    // retorna uma nova promessa
    return new Promise( ( resolve, reject ) => {

      // verifica se existe o usuario
      if ( user ) {
        reject( 'auth/cpf' );
        return;
      }

      // tenta obter o usuario na api
      this.api.get( `/api/verificar_cpf/${dados['cpf']}` )
      .then( func => {

        // cria o usuario com o firebase
        firebase.auth()
        .createUserWithEmailAndPassword( dados['email'], dados['password'] ).then( u => {

          // cria o objeto do usuario
          const obj = {
            [dados['cpf']] : {
              uid: u.uid,
              foto: null,
              email: dados['email'],
              created: new Date().getTime()
            }
          };

          // cria no firebase
          firebase.database().ref( `/usuarios` ).update( obj )
          .then( usr => resolve( usr ) )
          .catch( err => reject( err['code'] ) );
          
        })
        .catch( err => reject( err['code'] ) );

      })
      .catch( err => reject( err ) );
    });
  }

  // envia o email de recuperacao de senha
  public resetPassword( email: string ): firebase.Promise<void> {
    return firebase.auth().sendPasswordResetEmail(email);
  }

  // pega o usuario atual
  public async currentUser() {
    const uid = firebase.auth().currentUser.uid;
    const user = await this.setUid( uid );
    return user;
  }
  
  // faz a reauntenticacao
  public reauthenticate( pass:string ): firebase.Promise<void> {
    this.credentials = firebase.auth.EmailAuthProvider.credential(
        firebase.auth().currentUser.email,
        pass
      );
    return firebase.auth().currentUser.reauthenticateWithCredential( this.credentials );
  }

  // pega a foto
  public obterFoto( cpf ) {
    return new Promise( ( resolve, reject ) => {

      // pega o usuario
      this.obterUsuarioPorCpf( cpf ).then( user => {
        const usr = user.val();
        if ( usr ) {
          const foto =  usr.foto ? usr.foto : null;
          resolve( foto );
         } else resolve( null );
      })
      .catch( err => resolve( null ) );
    });
  }
}
