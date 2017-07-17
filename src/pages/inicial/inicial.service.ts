import { ApiProvider } from './../../providers/api/api';
import { Injectable } from "@angular/core";
import { Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { InicialModel } from './inicial.model';

@Injectable()
export class InicialService {
  constructor( public http: Http,
  public api : ApiProvider ) {}

  getData(): Promise<InicialModel> {
    return this.http.get('./assets/example_data/listing.json')
     .toPromise()
     .then(response => response.json() as InicialModel)
     .catch(this.handleError);
  }

  public obterCategorias() : Promise<Array<Object>> {
    return this.api.get('/api/obter_categorias');
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

}
