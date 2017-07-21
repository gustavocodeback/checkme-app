import { ApiProvider } from './../../providers/api/api';
import { Injectable } from "@angular/core";
import { Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class ListNotificacoesService {
  constructor( public http: Http,
  public api : ApiProvider ) {}

  getData(): Promise<Array<Object>> {
    return this.http.get('./assets/example_data/lists.json')
     .toPromise()
     .then(response => response.json())
     .catch(this.handleError);
  }

  // busca as notificacoes na api
  public obterNotificacoes( indice = 1 ) : Promise<Array<Object>> {

    // seta o indice
    indice = indice == 0 ? 1 : Math.floor( indice / 10 ) + 1;
    return this.api.get( '/api/obter_notificacoes_usuario/' + indice );
  }

  public lerNotificacoes( disparo ) : Promise<String> {
    return this.api.get( '/api/ler_notificacao/' + disparo );
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

}
