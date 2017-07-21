import { ApiProvider } from './../../providers/api/api';
import { Injectable } from "@angular/core";
import { Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { ListProdutosModel } from './list-produtos.model';

@Injectable()
export class ListProdutosService {
  constructor( public http: Http,
  public api : ApiProvider ) {}

  getData(): Promise<ListProdutosModel> {
    return this.http.get('./assets/example_data/lists.json')
     .toPromise()
     .then(response => response.json() as ListProdutosModel)
     .catch(this.handleError);
  }

  public obterProdutosCategoria( categoria, indice = 1 ) : Promise<Array<Object>> {
    indice = indice == 0 ? 1 : Math.floor( indice / 5 ) + 1;
    return this.api.get('/api/obter_produtos_categoria/'+categoria+'/'+indice);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

}
