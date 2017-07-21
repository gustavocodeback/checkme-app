import { ApiProvider } from './../../providers/api/api';
import { RankingPage } from './../ranking/ranking';
import { ListNotificacoesPage } from './../list-notificacoes/list-notificacoes';
import { Component } from '@angular/core';
import { InicialPage } from '../inicial/inicial';

@Component({
  selector: 'tabs-navigation',
  templateUrl: 'tabs-navigation.html'
})
export class TabsNavigationPage {
  tab1Root: any;
  tab2Root: any;
  tab3Root: any;
  badge = '';

  constructor( public api: ApiProvider ) {
    this.tab1Root = InicialPage;
    this.tab2Root = RankingPage;
    this.tab3Root = ListNotificacoesPage;
    let self = this;

    // aplica o callback
    this.api.notify( ( num ) => {

      // seta o badge
      self.badge = num == 0 ? '': num;
    });
  }
}
