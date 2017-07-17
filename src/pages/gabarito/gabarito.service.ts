import { ApiProvider } from './../../providers/api/api';
import { Injectable } from '@angular/core';

@Injectable()
export class GabaritoService {

    // metodo construtor
    public constructor( public api: ApiProvider ) {}

    // pega o gabarito
    public obterGabarito( quiz ) {
        return this.api.get( `/api/obter_gabarito/${quiz}` );
    }
}