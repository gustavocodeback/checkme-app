import { Injectable } from '@angular/core';
import constants from '../constants/constants';
import { Http, Headers, RequestOptionsArgs, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';


@Injectable()
export class ApiProvider {

  // url base
  public url;

  // callback de notificacao
  public callback;

  /**
   * constructor
   * 
   * método construtor
   * 
   */
  constructor( public http: Http ) {

    // pega a url
    this.url = constants.url;
  }

  public notify( callback ) {
    this.callback = callback;
  }

  /**
   * getHeaders
   * 
   * pega os headers que vao ser enviados
   * 
   * @return {RequestOptionsArgs}
   */
  private getHeaders(): RequestOptionsArgs {

    // pega os itens salvos no localstorage
    const email = localStorage.getItem( 'auth-email' );
    const uid = localStorage.getItem( 'auth-uid' );
    const cidade = localStorage.getItem( 'filter-cidade' );

    // seta os headers
    const headers = new Headers({
      'Content-Type'  : 'application/json',
      'Auth-Email'    : email,
      'Auth-Uid'      : uid,
      'Filter-Cidade' : cidade
    });

    // volta o objt
    return { headers };
  }

  /**
   * get
   * 
   * envia um get ao servidor
   * 
   * @param {string} url url da requisicao
   * 
   */
  public get( url ) {
    return this.__call( url, {}, 'get' );
  }

  /**
   * post
   * 
   * envia um post para o servidor
   * 
   * @param {string} url url da requisicao
   * @param {Object} data dados que serao enviados ao servidor
   * 
   */
  public post( url, data ) {
    return this.__call( url, data, 'post' );    
  }

  /**
   * __call
   * 
   * faz uma requisicao ao servidor
   * 
   * @param {string} requestUrl url da requisicao
   * @param {Object} data os dados a serem enviados
   * @param {string} method o metodo usado na request
   * 
   */
  private __call( requestUrl, data, method ) {

    // Retorna a promessa
    return new Promise<any>( ( resolve, reject ) => {

      // seta a url
      requestUrl = this.url+requestUrl;

      // Monta os dados
      const body = JSON.stringify(data);

      // seta as opcoes
      const options = new RequestOptions( this.getHeaders() );

      // Se recebeu o metodo (POST)
      const req = ( method === 'post' ) ? this.http.post( requestUrl, body, options ) : this.http.get( requestUrl, options );

      // pega a resposta
      req.toPromise().then( data => {
        console.log(data);
        // pega a resposta
        const body = data.json();

        console.log( 'corpo ', body );

        // pega a resposta
        if ( !body.code ) {
          reject( 'Erro na resposta da requisicao' );
          return;
        }

        // verifica o código
        switch( body.code ) {
          case '400':
            reject( body.message );
          break;
          case '200':
            resolve( body.data );
          break;
          case '403':
            resolve( 'Acesso negado' );
          break;
        }
      })
      .catch( error => reject( error ) );
    });
  }
}
