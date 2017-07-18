import { ApiProvider } from './../../providers/api/api';
import { Injectable } from '@angular/core';

@Injectable()
export class RankingService {

    // método construtor
    public constructor( public api: ApiProvider){}

    // obtem o ranking da loja
    public obterRankingLoja() {
        return this.api.get( `/api/obter_ranking_loja` );
    }

    // obtem o ranking da loja
    public obterRankingCluster() {
        return this.api.get( `/api/obter_ranking_cluster` );
    }

    // obtem o ranking da loja
    public obterMinhaPosicao() {
        return this.api.get( `/api/obter_minha_colocacao` );
    }
}
