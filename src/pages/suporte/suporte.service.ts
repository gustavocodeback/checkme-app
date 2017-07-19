import { ApiProvider } from './../../providers/api/api';
import { Injectable } from '@angular/core';

@Injectable()
export class SuporteService {

    // método construtor
    public constructor( public api: ApiProvider ){}

    // envia uma mensagem
    public enviarMensagem( msg ) {
        return this.api.post( `/api/enviar_mensagem`, { msg } );
    }

    // obtem as mensagem enviadas pelo usuário
    public obterMensagens( page ) {
        return this.api.get( `/api/obter_mensagens/${page}` );
    }
}