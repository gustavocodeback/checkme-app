import { RankingPage } from './../ranking/ranking';
import { ListNotificacoesPage } from './../list-notificacoes/list-notificacoes';
import { Component } from '@angular/core';
import { InicialPage } from '../inicial/inicial';
import { NotWorkingPage } from './../not-working/not-working';

@Component({
  selector: 'tabs-navigation',
  templateUrl: 'tabs-navigation.html'
})
export class TabsNavigationPage {
  tab1Root: any;
  tab2Root: any;
  tab3Root: any;

  constructor() {
    this.tab1Root = InicialPage;
    this.tab2Root = RankingPage;
    this.tab3Root = ListNotificacoesPage;
  }
}
