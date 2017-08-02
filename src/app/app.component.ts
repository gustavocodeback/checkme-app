import { EventosPage } from './../pages/eventos/eventos';
import { ApiProvider } from './../providers/api/api';
import { List1Page } from './../pages/list-1/list-1';
import { FeedPage } from './../pages/feed/feed';
import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, Nav, App, LoadingController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { FavoritosPage } from '../pages/favoritos/favoritos';
import { TabsNavigationPage } from '../pages/tabs-navigation/tabs-navigation';
import { FormsPage } from '../pages/forms/forms';
import { LayoutsPage } from '../pages/layouts/layouts';
import { WalkthroughPage } from '../pages/walkthrough/walkthrough';
import { SettingsPage } from '../pages/settings/settings';
import { FunctionalitiesPage } from '../pages/functionalities/functionalities';
import * as firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild(Nav) nav: Nav;

  // make WalkthroughPage the root (or first) page
  rootPage: any = WalkthroughPage;

  // paginas no menu
  pages: Array<{title: string, icon: string, component: any, options?:object }>;

  // paginas de push
  pushPages: Array<{title: string, icon: string, component: any, options?:object }>;

  constructor(
    platform: Platform,
    public menu: MenuController,
    public app: App,
    public splashScreen: SplashScreen,
    public statusBar: StatusBar,
    public api: ApiProvider,
    public loadingCtrl: LoadingController
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.splashScreen.hide();
      this.statusBar.styleDefault();
    });
    
    // inicializa o firebase
    const config = {
      apiKey: "AIzaSyD3-IcVgqiZeHmfSMcK9y5731BBBuW0-mY",
      authDomain: "my-project-36373.firebaseapp.com",
      databaseURL: "https://my-project-36373.firebaseio.com",
      projectId: "my-project-36373",
      storageBucket: "my-project-36373.appspot.com",
      messagingSenderId: "722920273323"
    };
    firebase.initializeApp( config );

    // vigia a autenticacao
    firebase.auth().onAuthStateChanged( user => {

      // verifica se existe um usuário
      if ( user ) {

        // pega os dados
        const dados = { uid: user.uid, email: user.email };

        // seta o loading
        const loading = this.loadingCtrl.create( { content: 'Verificando login...' } );
        loading.present();

        // chama a api
        this.api.post( `/checar_uid/${dados.uid}`, dados )
        .then( usr => {

          // seta o storage
          localStorage.setItem( 'auth-email', dados.email );
          localStorage.setItem( 'auth-uid', dados.uid );

          // redireciona
          this.nav.setRoot( TabsNavigationPage );
        })
        .catch( err => console.log( err ) )
        .then( () => loading.dismiss() );
      } else {

        // redireciona
        this.nav.setRoot( WalkthroughPage );
      }
    });

    this.pages = [
      { title: 'Home', icon: 'home', component: TabsNavigationPage },
      { title: 'Agenda', icon: 'bookmarks', component: EventosPage },
      { title: 'Comércios', icon: 'basket', component: List1Page, options: { tipo: 'estabelecimentos'} },
      { title: 'Turismo', icon: 'map', component: List1Page, options: { tipo: 'turismo'} },
      { title: 'Artistas/Bandas', icon: 'microphone', component: FeedPage },
      { title: 'Favoritos', icon: 'star', component: FavoritosPage },
      // { title: 'Forms', icon: 'create', component: FormsPage },
      // { title: 'Functionalities', icon: 'code', component: FunctionalitiesPage }
    ];

    this.pushPages = [
      // { title: 'Layouts', icon: 'grid', component: LayoutsPage },
      // { title: 'Settings', icon: 'settings', component: SettingsPage }
    ];
  }

  openPage(page) {
    
    // close the menu when clicking a link from the menu
    this.menu.close();
    
    // navigate to the new page if it is not the current page
    if ( page.options )
      this.nav.setRoot(page.component, page.options );
    else
      this.nav.setRoot(page.component );
  }

  pushPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // rootNav is now deprecated (since beta 11) (https://forum.ionicframework.com/t/cant-access-rootnav-after-upgrade-to-beta-11/59889)
    this.app.getRootNav().push(page.component);
  }
}
