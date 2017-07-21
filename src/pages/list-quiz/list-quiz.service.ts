import { ApiProvider } from './../../providers/api/api';
import { Injectable } from "@angular/core";
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ListQuizService {
  constructor( public api : ApiProvider ) {}

  public obterQuestionarios( indice = 1 ) : Promise<Array<Object>> {
    indice = indice == 0 ? 1 : Math.floor( indice / 5 ) + 1;
    return this.api.get(`/api/obter_questionarios/${indice}`);
  }
}
