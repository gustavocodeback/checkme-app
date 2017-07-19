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

  public obterNotificacoes( indice = 1 ) : Promise<Array<Object>> {
    indice = indice == 0 ? 1 : Math.floor( indice / 10 ) + 1;
    return this.api.get( '/api/obter_notificacoes_usuario/' + indice );
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

}
