import { ApiProvider } from './../../providers/api/api';
import { Injectable } from '@angular/core';

@Injectable()
export class ResponderService {

    // método construtor
    public constructor( public api: ApiProvider ) {}

    // obtem as perguntas do quiz
    public obterPerguntas( quiz ) {
        return this.api.get( `/api/obter_perguntas/${quiz}` )
    }

    // responde uma pergunta
    public responder( id, resposta ) {
        return this.api.post( `/api/responder_pergunta/${id}`, { resposta } );
    }

    // responde uma pergunta
    public encerrar( id ) {
        return this.api.get( `/api/encerrar_questionario/${id}` );
    }
}

/* end file */
