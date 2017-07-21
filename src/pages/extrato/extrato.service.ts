import { Injectable } from '@angular/core';
import { ApiProvider } from './../../providers/api/api';

@Injectable()
export class ExtratoService {

    // metodo construtor
    public constructor( public api: ApiProvider ) {}

    // pega o extrato
    public obterExtrato( pagina ) {
        return this.api.get( `/api/obter_extrato/${pagina}` );
    }
}